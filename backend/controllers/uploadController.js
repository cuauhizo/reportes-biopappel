// backend/controllers/uploadController.js
const { pool } = require('../utils/db')
const csv = require('csv-parser')
const { Readable } = require('stream')

// Generador de IDs únicos para posts
// 🚀 FIX 2: ID blindado contra solapamiento de fechas y multi-idioma
const generarIdEstable = (postExcel, prefijo, periodo) => {
  const keys = Object.keys(postExcel)
  const idKey = keys.find(k => k.toLowerCase().includes('post id') || k.toLowerCase().trim() === 'id' || k.toLowerCase().includes('id de pub'))

  let idGenerado = ''
  if (idKey && postExcel[idKey]) {
    idGenerado = String(postExcel[idKey]).trim()
  } else {
    const link = postExcel['Post URL'] || postExcel.postPermalink || postExcel['Post Permalink'] || postExcel['Enlace permanente'] || ''
    if (link) {
      idGenerado = link.replace(/[^a-zA-Z0-9]/g, '').slice(-15)
    } else {
      const texto = postExcel.mensaje || postExcel['Post Message'] || postExcel['Message'] || postExcel['Mensaje'] || 'sin_texto'
      idGenerado = texto.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20)
    }
  }

  // Forzamos que el ID incluya el mes y la red social siempre
  return `${periodo}_${prefijo}_${idGenerado}`
}

const processCsvUpload = async (req, res) => {
  const { type, periodo } = req.params
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' })

  const results = []

  // Convertimos el archivo en RAM a un flujo de datos que csv-parser puede leer
  Readable.from(req.file.buffer)
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', async () => {
      try {
        const connection = await pool.getConnection()

        // ==========================================
        // 1. PROCESAR MÉTRICAS DE POSTS (FB e IG)
        // ==========================================
        if (type === 'fb_posts' || type === 'ig_posts' || type === 'li_posts') {
          let prefijo = 'fb'
          let tabla = 'fb_posts_metrics'

          if (type === 'ig_posts') {
            prefijo = 'ig'
            tabla = 'ig_posts_metrics'
          } else if (type === 'li_posts') {
            prefijo = 'li'
            tabla = 'li_posts_metrics'
          }

          await connection.query(`DELETE FROM ${tabla} WHERE periodo = ?`, [periodo])

          for (const row of results) {
            // 🚀 FIX 1: Evitar duplicados ignorando las fotos hijas de los carruseles/documentos
            const tipoPostStr = String(row['Post Type'] || row['Tipo de publicación'] || 'POST').toUpperCase()
            if (tipoPostStr.includes('ITEM')) {
              continue // Salta esta iteración, no lo guarda en la BD
            }

            const mensaje = row['POST MESSAGE'] || row['Post Message'] || ''
            const tipoPost = row['POST TYPE'] || row['Post Type'] || ''

            if (mensaje || tipoPost.toUpperCase().includes('STORY')) {
              const id = generarIdEstable(row, prefijo, periodo)
              const fecha = row['DATE (GMT)'] || row['Date (GMT)'] || null
              const alcance = parseInt(row['REACH'] || row['Reach'] || 0)
              const interacciones = parseInt(row['ENGAGEMENT'] || row['Engagement'] || 0)
              const visitas = parseInt(row['POST VIEWS'] || row['Post views'] || row['Views'] || 0)
              const likes = parseInt(row['LIKES'] || row['Likes'] || 0)
              const shares = parseInt(row['SHARES'] || row['Shares'] || 0)
              const permalink = row['POST PERMALINK'] || row['Post Permalink'] || ''
              const tags = row['POST TAGS'] || row['Post Tags'] || row['Etiquetas'] || ''

              if (type === 'fb_posts') {
                await connection.query(
                  `INSERT INTO fb_posts_metrics (id, periodo, mensaje, tipo_post, fecha, alcance, interacciones, visitas, likes, shares, permalink, tags) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE visitas=VALUES(visitas)`,
                  [id, periodo, mensaje, tipoPost, fecha, alcance, interacciones, visitas, likes, shares, permalink, tags],
                )
              } else if (type === 'ig_posts') {
                const saves = parseInt(row['SAVES'] || row['Saves'] || 0)
                await connection.query(
                  `INSERT INTO ig_posts_metrics (id, periodo, mensaje, tipo_post, fecha, alcance, interacciones, visitas, likes, saves, shares, permalink, tags) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE visitas=VALUES(visitas)`,
                  [id, periodo, mensaje, tipoPost, fecha, alcance, interacciones, visitas, likes, saves, shares, permalink, tags],
                )
              }
            }

            if (type === 'li_posts') {
              const mensaje = row['Post Message'] || ''
              const id = generarIdEstable(row, prefijo, periodo)
              const tipoPost = row['Post Type'] || 'POST'
              const fecha = row['Date (GMT)'] || null
              const impresiones = parseInt(row['Impressions']) || 0
              const alcance = parseInt(row['Reach']) || 0
              const interacciones = parseInt(row['Engagement']) || 0 // O sumando las demás
              const reacciones = parseInt(row['Reactions']) || 0
              const comentarios = parseInt(row['Comments']) || 0
              const shares = parseInt(row['Shares']) || 0
              const clics = parseInt(row['Clicks']) || 0
              const permalink = row['LinkedIn Post URL'] || ''
              const tags = row['Post Tags'] || ''

              await connection.query(
                `INSERT INTO li_posts_metrics (id, periodo, mensaje, tipo_post, fecha, impresiones, alcance, interacciones, reacciones, comentarios, shares, clics, permalink, tags) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE impresiones=VALUES(impresiones)`,
                [id, periodo, mensaje, tipoPost, fecha, impresiones, alcance, interacciones, reacciones, comentarios, shares, clics, permalink, tags],
              )
            }
          }
        }

        // ==========================================
        // 2. PROCESAR SENTIMIENTOS (FB e IG)
        // ==========================================
        else if (type === 'fb_sentiment' || type === 'ig_sentiment') {
          const red_social = type === 'fb_sentiment' ? 'fb' : 'ig'

          await connection.query('DELETE FROM inbound_sentiment WHERE periodo = ? AND red_social = ?', [periodo, red_social])

          let positive = 0,
            neutral = 0,
            negative = 0
          for (const row of results) {
            const keySentiment = Object.keys(row).find(k => k.toLowerCase().includes('sentiment'))
            if (keySentiment && row[keySentiment]) {
              const val = row[keySentiment].trim().toLowerCase()
              if (val === 'positive') positive++
              else if (val === 'neutral') neutral++
              else if (val === 'negative') negative++
            }
          }

          await connection.query(
            `INSERT INTO inbound_sentiment (periodo, red_social, sentimiento, cantidad) VALUES 
            (?, ?, 'positive', ?), (?, ?, 'neutral', ?), (?, ?, 'negative', ?)`,
            [periodo, red_social, positive, periodo, red_social, neutral, periodo, red_social, negative],
          )
        }

        // ==========================================
        // 3. PROCESAR OVERVIEWS (Métricas globales, Histórico Diario y Ciudades)
        // ==========================================
        else if (type === 'fb_overview' || type === 'ig_overview' || type === 'li_overview') {
          // const red_social = type === 'fb_overview' ? 'fb' : 'ig'
          const red_social = type === 'fb_overview' ? 'fb' : type === 'ig_overview' ? 'ig' : 'li'

          await connection.query('DELETE FROM network_kpis WHERE periodo = ? AND red_social = ?', [periodo, red_social])
          await connection.query('DELETE FROM historical_followers WHERE periodo = ? AND red_social = ?', [periodo, red_social])
          await connection.query('DELETE FROM top_cities WHERE periodo = ? AND red_social = ?', [periodo, red_social])

          let kpis = {}
          let historical = []
          let cities = []
          let maxCarousel = 0,
            maxPhoto = 0,
            maxReel = 0,
            maxStory = 0

          for (const row of results) {
            const keys = Object.keys(row)
            const keyDate = keys.find(k => k.toLowerCase().includes('date') || k.toLowerCase().includes('fecha'))
            const dateVal = keyDate && row[keyDate] ? row[keyDate].split(' ')[0] : null

            if (type === 'fb_overview') {
              const keyTotalFollowers = keys.find(k => k.includes('Total followers'))
              const keyFollowersForTable = keys.find(k => k.includes('Seguidores (This column might contain'))
              const keyInteractions = keys.find(k => k.includes('Interacciones de la página'))

              // A. Histórico Diario
              if (dateVal && !dateVal.toLowerCase().includes('total')) {
                let daily = parseInt(row[keyFollowersForTable]) || parseInt(row[keyTotalFollowers]) || 0
                if (daily > 0) historical.push({ fecha: dateVal, followers: daily })
              }

              // B. KPIs Globales (Buscamos la fila donde vienen todos los totales juntos)
              if (keyInteractions && row[keyInteractions] && keyTotalFollowers && row[keyTotalFollowers]) {
                kpis = {
                  total_followers: parseInt(row[keyTotalFollowers]) || 0,
                  new_followers: parseInt(row[keys.find(k => k.includes('Nuevos seguidores'))]) || 0,
                  engagement_rate: parseFloat(row[keys.find(k => k.includes('Post engagement rate'))]) || 0,
                  fb_interactions: parseInt(row[keyInteractions]) || 0,
                  fb_clics: parseInt(row[keys.find(k => k.includes('Post link clicks'))]) || 0,
                  fb_shares: parseInt(row[keys.find(k => k.includes('Post shares'))]) || 0,
                  fb_comments: parseInt(row[keys.find(k => k.includes('Comentarios y respuestas'))]) || 0,
                  fb_post_impressions: parseInt(row[keys.find(k => k.includes('Impresiones orgánicas'))]) || 0,
                  fb_page_organic_reach: parseInt(row[keys.find(k => k.includes('Alcance orgánico de la página'))]) || 0,
                  fb_page_no_followers_views: parseInt(row[keys.find(k => k.includes('Vistas de página de no seguidores'))]) || 0,
                  fb_page_followers_views: parseInt(row[keys.find(k => k.includes('Visualizaciones de seguidores'))]) || 0,
                  fb_time_visualization: row[keys.find(k => k.includes('Tiempo de visualización'))] || '0',
                }

                // C. Ciudades Top
                const cityKeys = keys.filter(k => k.includes('Seguidores de la página > Ciudad'))
                cityKeys.forEach(k => {
                  let cityName = k.includes('Other') ? 'Other' : k.split('Ciudad - ')[1]?.split(' (')[0] || ''
                  if (cityName !== 'Other' && cityName.includes(',')) cityName = `${cityName.split(',')[0].trim()}, ${cityName.split(',')[1].trim()}`
                  const f = parseInt(row[k]) || 0
                  if (f > 0) cities.push({ name: cityName.trim(), followers: f })
                })
              }
            } else {
              // Lógica IG
              const keyTotalFollowers = keys.find(k => k.includes('Followers') && !k.includes('Daily'))
              const keyHistoryFollowers = keys.find(k => k.includes('Seguidores (Daily'))

              const keyReachCarousel = keys.find(k => k.includes('Post reach - Carousel'))
              const keyReachPhoto = keys.find(k => k.includes('Post reach - Photo'))
              const keyReachReel = keys.find(k => k.includes('Post reach - Reel'))
              const keyReachStory = keys.find(k => k.includes('Post reach - Story'))

              if (keyReachCarousel) maxCarousel = Math.max(maxCarousel, parseInt(row[keyReachCarousel]) || 0)
              if (keyReachPhoto) maxPhoto = Math.max(maxPhoto, parseInt(row[keyReachPhoto]) || 0)
              if (keyReachReel) maxReel = Math.max(maxReel, parseInt(row[keyReachReel]) || 0)
              if (keyReachStory) maxStory = Math.max(maxStory, parseInt(row[keyReachStory]) || 0)

              if (dateVal && !dateVal.toLowerCase().includes('total')) {
                let daily = parseInt(row[keyHistoryFollowers]) || 0
                if (daily >= 0) historical.push({ fecha: dateVal, followers: daily })
              }

              if (keyTotalFollowers && row[keyTotalFollowers]) {
                kpis = {
                  total_followers: parseInt(row[keyTotalFollowers]) || 0,
                  engagement_rate: parseFloat(row[keys.find(k => k.includes('Page engagement rate'))]) || 0,
                  ig_story_taps_forward: parseInt(row[keys.find(k => k.includes('Story taps forward'))]) || 0,
                  ig_story_taps_back: parseInt(row[keys.find(k => k.includes('Story taps back'))]) || 0,
                  ig_story_exits: parseInt(row[keys.find(k => k.includes('Story exits'))]) || 0,
                  ig_post_saves: parseInt(row[keys.find(k => k.includes('Post saves'))]) || 0,
                  ig_post_likes: parseInt(row[keys.find(k => k.includes('Post likes'))]) || 0,
                  ig_post_impressions: parseInt(row[keys.find(k => k.includes('Impresiones de publicaciones'))]) || 0,
                }

                const cityKeys = keys.filter(k => k.includes('Audience > City') || k.includes('Seguidores de la página > Ciudad'))
                cityKeys.forEach(k => {
                  let cityName = k.includes('Other') ? 'Other' : k.split('City - ')[1]?.split(' (')[0] || k.split('Ciudad - ')[1]?.split(' (')[0] || ''
                  if (cityName !== 'Other' && cityName.includes(',')) cityName = `${cityName.split(',')[0].trim()}, ${cityName.split(',')[1].trim()}`
                  const f = parseInt(row[k]) || 0
                  if (f > 0) cities.push({ name: cityName.trim(), followers: f })
                })
              }
            }

            if (type === 'li_overview') {
              // const keyTotalFollowers = keys.find(k => k.includes('Seguidores (Overall aggregated value') && !k.includes('This column'))
              // const keyFollowersForTable = keys.find(k => k.includes('Seguidores (This column might contain'))

              const keyTotalFollowers = keys.find(k => (k.startsWith('Seguidores (Overall aggregated value') || k.startsWith('Followers (Overall')) && !k.includes('This column'))
              const keyFollowersForTable = keys.find(k => k.includes('Seguidores (Daily'))

              // A. Histórico Diario
              if (dateVal && !dateVal.toLowerCase().includes('total')) {
                let daily = parseInt(row[keyFollowersForTable]) || parseInt(row[keyTotalFollowers]) || 0
                if (daily > 0) historical.push({ fecha: dateVal, followers: daily })
              }

              // Guardar en historical_followers igual que FB e IG
              if (keyTotalFollowers && row[keyTotalFollowers]) {
                kpis = {
                  total_followers: parseInt(row[keyTotalFollowers]) || 0,
                  new_followers: parseInt(row[keys.find(k => k.includes('Nuevos seguidores netos'))]) || 0,
                  engagement_rate: parseFloat(row[keys.find(k => k.includes('Porcentaje de interacción con publicación'))]) || 0,

                  li_page_reach: parseFloat(row[keys.find(k => k.includes('Alcance de página (Overall aggregated value'))]) || 0,
                  li_page_engagements_rate: parseFloat(row[keys.find(k => k.includes('Porcentaje de interacción con la página (Overall aggregated value'))]) || 0,
                  li_page_clicks: parseInt(row[keys.find(k => k.includes('Clics en página'))]) || 0,
                  li_page_comments: parseInt(row[keys.find(k => k.includes('Comentarios de página'))]) || 0,
                  li_posts: parseInt(row[keys.find(k => k.includes('Publicaciones'))]) || 0,
                  li_post_comments: parseInt(row[keys.find(k => k.includes('Comentarios en publicación'))]) || 0,
                  li_page_shares: parseInt(row[keys.find(k => k.includes('Comparticiones de página'))]) || 0,
                  li_post_reach: parseInt(row[keys.find(k => k.includes('Alcance de publicaciones'))]) || 0,
                  li_post_video_viewers: parseInt(row[keys.find(k => k.includes('Espectadores de vídeos de publicaciones'))]) || 0,
                  li_post_reactions: parseInt(row[keys.find(k => k.includes('Reacciones a publicaciones'))]) || 0,
                  li_page_engagement: parseInt(row[keys.find(k => k.includes('Interacción con páginas'))]) || 0,
                }

                const cityKeys = keys.filter(k => k.includes('Seguidores -'))
                cityKeys.forEach(k => {
                  let cityName = k.includes('Other') ? 'Other' : k.split('Seguidores - ')[1]?.split(' (')[0] || ''
                  if (cityName !== 'Other' && cityName.includes(',')) cityName = `${cityName.split(',')[0].trim()}, ${cityName.split(',')[1].trim()}`
                  const f = parseInt(row[k]) || 0
                  if (f > 0) cities.push({ name: cityName.trim(), followers: f })
                })
              }
              // Guardar los totales en kpis = { ... }
            }
          }

          // GUARDAMOS TODO EN MYSQL
          if (Object.keys(kpis).length > 0) {
            if (type === 'ig_overview') {
              kpis.ig_reach_carousel = maxCarousel
              kpis.ig_reach_photo = maxPhoto
              kpis.ig_reach_reel = maxReel
              kpis.ig_reach_story = maxStory
            }
            const cols = Object.keys(kpis)
            const vals = Object.values(kpis)

            // 🚀 FIX 4: ON DUPLICATE KEY UPDATE dinámico
            const updateStr = cols.map(col => `${col}=VALUES(${col})`).join(', ')

            await connection.query(
              `INSERT INTO network_kpis (periodo, red_social, ${cols.join(', ')}) 
               VALUES (?, ?, ${cols.map(() => '?').join(', ')}) 
               ON DUPLICATE KEY UPDATE ${updateStr}`,
              [periodo, red_social, ...vals],
            )
          }

          for (const h of historical) {
            await connection.query('INSERT IGNORE INTO historical_followers (periodo, red_social, fecha, followers) VALUES (?, ?, ?, ?)', [periodo, red_social, h.fecha, h.followers])
          }

          for (const c of cities) {
            await connection.query('INSERT INTO top_cities (periodo, red_social, city_name, followers) VALUES (?, ?, ?, ?)', [periodo, red_social, c.name, c.followers])
          }
        }

        connection.release()
        res.json({ message: `Archivo ${type} analizado y guardado en la Base de Datos con éxito.` })
      } catch (error) {
        console.error(`Error procesando CSV de ${type}:`, error)
        res.status(500).json({ error: 'Error interno guardando los datos en MySQL.' })
      }
    })
}

module.exports = { processCsvUpload }

const findKey = (row, keywords) => {
  const keys = Object.keys(row)
  return keys.find(k => keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase())))
}

const getValNum = (row, keywords) => {
  const key = findKey(row, keywords)
  return key ? parseFloat(row[key]) || 0 : 0
}

const getValStr = (row, keywords) => {
  const key = findKey(row, keywords)
  return key ? String(row[key]) : ''
}

const parseXOverview = (results, periodo) => {
  let followers = []
  // 🚀 1. KPIs con totales y métricas de X
  let kpis = { total_followers: 0, new_followers: 0, x_impressions: 0, x_likes: 0, x_reposts: 0, x_replies: 0, x_url_clicks: 0 }

  results.forEach(row => {
    const fechaRaw = getValStr(row, ['date', 'fecha'])
    const followersCount = getValNum(row, ['seguidores (daily', 'followers (daily'])

    // 🚀 2. Filtro anti-basura (Ignoramos 'Total', 'N/A' y vacíos)
    if (fechaRaw && !isNaN(followersCount) && !fechaRaw.toLowerCase().includes('total') && fechaRaw.toUpperCase() !== 'N/A') {
      followers.push({
        periodo,
        red_social: 'x',
        fecha: fechaRaw.split(' ')[0],
        followers: followersCount,
      })
    }

    // 🚀 3. Extraemos Totales y Nuevos Seguidores
    const currentTotal = getValNum(row, ['seguidores (overall', 'total followers'])
    if (currentTotal > 0) kpis.total_followers = currentTotal

    const currentNew = getValNum(row, ['nuevos seguidores netos', 'nuevos seguidores', 'new followers'])
    if (currentNew !== 0 || kpis.new_followers === 0) kpis.new_followers = currentNew

    // 🚀 4. Suma Iterativa de KPIs con traducciones exactas del CSV
    kpis.x_impressions += getValNum(row, ['impresiones de publicaciones (daily', 'impressions'])

    // Hootsuite mezcla Likes y Replies en X dentro de "Interacciones"
    kpis.x_likes += getValNum(row, ['interacciones con publicaciones (daily', 'likes', 'me gusta'])
    kpis.x_reposts += getValNum(row, ['publicar republicaciones (daily', 'retweets', 'reposts'])
    kpis.x_url_clicks += getValNum(row, ['clics en enlaces de publicaciones (daily', 'url clicks'])
  })

  return { type: 'overview', followers, kpis }
}

const parseXPosts = (results, periodo) => {
  let posts = []

  results.forEach(row => {
    const fechaRaw = getValStr(row, ['date', 'fecha'])

    // 🚀 5. BLOQUEO DE ERRORES 500 (Filas basura como 'N/A')
    if (!fechaRaw || fechaRaw.toLowerCase().includes('total') || fechaRaw.toUpperCase() === 'N/A') return

    posts.push({
      periodo,
      date: fechaRaw,
      permalink: getValStr(row, ['tweet permalink', 'permalink', 'url']),
      post_message: getValStr(row, ['tweet text', 'post message', 'mensaje']),
      media_type: getValStr(row, ['media type', 'tipo']) || 'Tweet',
      tags: getValStr(row, ['tweet tags', 'post tags', 'etiquetas']) || null,
      campaign: getValStr(row, ['tweet campaign', 'post campaign', 'campaña']) || null,

      // Métricas de la tabla de publicaciones
      impressions: getValNum(row, ['impressions', 'impresiones']),
      reposts: getValNum(row, ['retweets', 'reposts', 'republicaciones']),
      quote_tweets: getValNum(row, ['quote tweets', 'citas']),
      likes: getValNum(row, ['likes', 'me gusta']),
      replies: getValNum(row, ['replies', 'respuestas']),
      url_clicks: getValNum(row, ['url clicks', 'clics']),
      engagement_rate: parseFloat(getValNum(row, ['engagement rate', 'engagement'])).toFixed(2),
    })
  })

  return { type: 'posts', posts }
}

module.exports = { parseXOverview, parseXPosts }

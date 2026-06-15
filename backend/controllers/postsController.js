const { pool } = require('../utils/db')

// 1. OBTENER POSTS CRUDOS PARA EDITAR
const getPosts = async (req, res) => {
  const { periodo, red_social } = req.query
  if (!periodo || !red_social) return res.status(400).json({ error: 'Faltan parámetros' })

  // 🚀 Lógica de enrutamiento correcta para 5 redes
  let tabla = ''
  let orderCol = 'fecha'

  if (red_social === 'fb') tabla = 'fb_posts_metrics'
  else if (red_social === 'ig' || red_social === 'instagram') tabla = 'ig_posts_metrics'
  else if (red_social === 'li' || red_social === 'linkedin') tabla = 'li_posts_metrics'
  else if (red_social === 'tk' || red_social === 'tiktok') {
    tabla = 'tk_posts_metrics'
    orderCol = 'date' // 🚀 En TikTok se llama 'date'
  } else if (red_social === 'x') {
    tabla = 'x_posts_metrics'
    orderCol = 'date' // 🚀 En X se llama 'date'
  } else return res.status(400).json({ error: 'Red social no válida' })

  try {
    const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE periodo = ? ORDER BY ${orderCol} DESC`, [periodo])
    res.json(rows)
  } catch (error) {
    console.error('Error en getPosts:', error)
    res.status(500).json({ error: 'Error interno al obtener los posts.' })
  }
}

// 2. ACTUALIZAR UN POST INDIVIDUAL
const updatePost = async (req, res) => {
  const { id } = req.params
  const post = req.body

  // Autodetectar red social ciegamente si no viene en el body
  const red_social = req.body.red_social || (id.includes('_fb_') ? 'fb' : id.includes('_li_') ? 'li' : id.includes('_tk_') ? 'tk' : id.includes('_x_') ? 'x' : 'ig')

  try {
    let query = ''
    let params = []

    if (red_social === 'li') {
      // Consulta para LinkedIn
      query = `UPDATE li_posts_metrics 
               SET impresiones = ?, alcance = ?, clics = ?, reacciones = ?, comentarios = ?, shares = ?, tags = ? 
               WHERE id = ?`
      params = [post.impresiones, post.alcance, post.clics, post.reacciones, post.comentarios, post.shares, post.tags, id]
    } else if (red_social === 'ig') {
      // Consulta para Instagram
      query = `UPDATE ig_posts_metrics 
               SET visitas = ?, alcance = ?, interacciones = ?, likes = ?, shares = ?, tags = ? 
               WHERE id = ?`
      params = [post.visitas, post.alcance, post.interacciones, post.likes, post.shares, post.tags, id]
    } else if (red_social === 'tk') {
      // 🚀 Consulta para TikTok
      query = `UPDATE tk_posts_metrics 
               SET video_views = ?, reach = ?, likes = ?, comments = ?, shares = ?, tags = ? 
               WHERE id = ?`
      params = [post.video_views || 0, post.reach || 0, post.likes || 0, post.comments || 0, post.shares || 0, post.tags, id]
    } else if (red_social === 'x') {
      // 🚀 Consulta para X (Twitter)
      query = `UPDATE x_posts_metrics 
               SET impressions = ?, likes = ?, reposts = ?, replies = ?, tags = ? 
               WHERE id = ?`
      params = [post.impressions || 0, post.likes || 0, post.reposts || 0, post.replies || 0, post.tags, id]
    } else {
      // Consulta para Facebook
      query = `UPDATE fb_posts_metrics 
               SET visitas = ?, alcance = ?, interacciones = ?, likes = ?, shares = ?, tags = ? 
               WHERE id = ?`
      params = [post.visitas, post.alcance, post.interacciones, post.likes, post.shares, post.tags, id]
    }

    await pool.query(query, params)
    res.json({ message: 'Post actualizado correctamente' })
  } catch (error) {
    console.error('Error actualizando post:', error)
    res.status(500).json({ error: 'Error al actualizar post' })
  }
}

module.exports = { getPosts, updatePost }

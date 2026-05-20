const { pool } = require('../utils/db')

// 1. OBTENER POSTS CRUDOS PARA EDITAR
const getPosts = async (req, res) => {
  const { periodo, red_social } = req.query
  if (!periodo || !red_social) return res.status(400).json({ error: 'Faltan parámetros' })

  let tabla = 'fb_posts_metrics'
  if (red_social === 'ig' || red_social === 'instagram') tabla = 'ig_posts_metrics'
  if (red_social === 'li' || red_social === 'linkedin') tabla = 'li_posts_metrics'

  try {
    const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE periodo = ? ORDER BY fecha DESC`, [periodo])
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
  const red_social = req.body.red_social || (id.startsWith('fb_') ? 'fb' : id.startsWith('li_') ? 'li' : 'ig') // Autodetectar red social

  try {
    let query = ''
    let params = []

    if (red_social === 'li') {
      // 🚀 Consulta para LinkedIn
      query = `UPDATE li_posts_metrics 
               SET impresiones = ?, alcance = ?, clics = ?, reacciones = ?, comentarios = ?, shares = ?, tags = ? 
               WHERE id = ?`
      params = [post.impresiones, post.alcance, post.clics, post.reacciones, post.comentarios, post.shares, post.tags, id]
    } else if (red_social === 'ig') {
      // Consulta para Instagram
      query = `UPDATE ig_posts_metrics 
               SET vistas = ?, alcance = ?, interacciones = ?, likes = ?, saves = ?, tags = ? 
               WHERE id = ?`
      params = [post.vistas, post.alcance, post.interacciones, post.likes, post.saves, post.tags, id]
    } else {
      // Consulta para Facebook
      query = `UPDATE fb_posts_metrics 
               SET vistas = ?, alcance = ?, interacciones = ?, likes = ?, shares = ?, tags = ? 
               WHERE id = ?`
      params = [post.vistas, post.alcance, post.interacciones, post.likes, post.shares, post.tags, id]
    }

    await pool.query(query, params)
    res.json({ message: 'Post actualizado correctamente' })
  } catch (error) {
    console.error('Error actualizando post:', error)
    res.status(500).json({ error: 'Error al actualizar post' })
  }
}

module.exports = { getPosts, updatePost }

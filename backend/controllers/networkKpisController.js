const { pool } = require('../utils/db')

// 1. OBTENER LAS MÉTRICAS DE UNA RED EN UN MES
const getNetworkKpis = async (req, res) => {
  const { periodo, red_social } = req.query
  if (!periodo || !red_social) return res.status(400).json({ error: 'Faltan parámetros' })

  try {
    const [rows] = await pool.query('SELECT * FROM network_kpis WHERE periodo = ? AND red_social = ?', [periodo, red_social])
    // Si no hay datos, devolvemos un objeto vacío para que el Frontend no explote
    res.json(rows[0] || {})
  } catch (error) {
    console.error('Error en getNetworkKpis:', error)
    res.status(500).json({ error: 'Error interno al obtener los KPIs de la red.' })
  }
}

// 2. ACTUALIZAR LAS MÉTRICAS MANUALMENTE
const updateNetworkKpis = async (req, res) => {
  const { periodo, red_social } = req.body
  if (!periodo || !red_social) return res.status(400).json({ error: 'Faltan parámetros' })

  // Sacamos el periodo y la red social del objeto, nos quedamos solo con los números a actualizar
  const updateFields = { ...req.body }
  delete updateFields.periodo
  delete updateFields.red_social
  delete updateFields.id // Por seguridad, no permitimos cambiar el ID

  // Si nos mandaron un objeto vacío, no hacemos nada
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: 'No hay datos para actualizar' })
  }

  // Magia: Construimos el "SET fb_clics = ?, fb_shares = ?" de forma automática
  const setClause = Object.keys(updateFields)
    .map(key => `${key} = ?`)
    .join(', ')
  const values = Object.values(updateFields)

  try {
    const [result] = await pool.query(`UPDATE network_kpis SET ${setClause} WHERE periodo = ? AND red_social = ?`, [...values, periodo, red_social])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontraron métricas para ese mes. Sube primero el CSV.' })
    }

    res.json({ message: 'Métricas actualizadas correctamente' })
  } catch (error) {
    console.error('Error en updateNetworkKpis:', error)
    res.status(500).json({ error: 'Error interno al actualizar las métricas.' })
  }
}

// 3. OBTENER HISTÓRICO DIARIO
const getHistorical = async (req, res) => {
  const { periodo, red_social } = req.query
  if (!periodo || !red_social) return res.status(400).json({ error: 'Faltan parámetros' })

  try {
    const [rows] = await pool.query('SELECT * FROM historical_followers WHERE periodo = ? AND red_social = ? ORDER BY fecha ASC', [periodo, red_social])
    res.json(rows)
  } catch (error) {
    console.error('Error en getHistorical:', error)
    res.status(500).json({ error: 'Error interno al obtener el histórico.' })
  }
}

// 4. ACTUALIZAR HISTÓRICO DIARIO
const updateHistorical = async (req, res) => {
  const { periodo, red_social, historical } = req.body
  if (!periodo || !red_social || !Array.isArray(historical)) return res.status(400).json({ error: 'Faltan parámetros' })

  try {
    const connection = await pool.getConnection()
    for (const h of historical) {
      await connection.query('UPDATE historical_followers SET followers = ?, published_posts = ? WHERE id = ?', [h.followers, h.published_posts || 0, h.id])
    }
    connection.release()
    res.json({ message: 'Histórico actualizado correctamente' })
  } catch (error) {
    console.error('Error en updateHistorical:', error)
    res.status(500).json({ error: 'Error interno al actualizar el histórico.' })
  }
}

// Asegúrate de exportarlas actualizando tu última línea a esto:
module.exports = { getNetworkKpis, updateNetworkKpis, getHistorical, updateHistorical }

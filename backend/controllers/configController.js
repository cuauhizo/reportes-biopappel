const { pool } = require('../utils/db')

const getConfigs = async (req, res) => {
  const { periodo } = req.query
  if (!periodo) return res.status(400).json({ error: 'Periodo requerido' })

  try {
    const [rows] = await pool.query('SELECT * FROM report_configs WHERE periodo = ?', [periodo])
    // Convertimos el array en un objeto fácil de leer para el Frontend
    const configMap = {}
    rows.forEach(r => {
      configMap[`${r.red_social}_${r.config_key}`] = !!r.is_visible
    })
    res.json(configMap)
  } catch (error) {
    console.error('Error en getConfigs:', error)
    res.status(500).json({ error: 'Error interno obteniendo configuraciones' })
  }
}

const updateConfigs = async (req, res) => {
  const { periodo, configs } = req.body // configs es un objeto { 'li_show_section': false, ... }
  if (!periodo || !configs) return res.status(400).json({ error: 'Faltan parámetros' })

  try {
    const connection = await pool.getConnection()

    for (const [fullKey, isVisible] of Object.entries(configs)) {
      // Separamos el prefijo de la red social de la llave (ej: 'li' y 'show_section')
      const index = fullKey.indexOf('_')
      const red_social = fullKey.substring(0, index)
      const config_key = fullKey.substring(index + 1)

      await connection.query(
        `INSERT INTO report_configs (periodo, red_social, config_key, is_visible) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE is_visible = VALUES(is_visible)`,
        [periodo, red_social, config_key, isVisible],
      )
    }

    connection.release()
    res.json({ message: 'Configuraciones guardadas con éxito' })
  } catch (error) {
    console.error('Error en updateConfigs:', error)
    res.status(500).json({ error: 'Error interno guardando configuraciones' })
  }
}

module.exports = { getConfigs, updateConfigs }

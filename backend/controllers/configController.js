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
  const { periodo, configs } = req.body
  if (!periodo || !configs) return res.status(400).json({ error: 'Faltan parámetros' })

  try {
    // 1. Si el periodo ya está bloqueado, prevenir cualquier modificación EXCEPTO si se está intentando desbloquear
    const isCurrentlyLocked = await checkIfPeriodIsLocked(periodo)

    // Si el periodo está bloqueado y en la petición 'general_is_locked' sigue siendo true, rechazamos el cambio
    if (isCurrentlyLocked && configs['general_is_locked'] === true) {
      // 🚀 CAMBIO CLAVE: Usamos status(400) en lugar de 403
      return res.status(400).json({ error: 'Este periodo está bloqueado. Desbloquéalo primero para realizar cambios.' })
    }

    const connection = await pool.getConnection()

    for (const [fullKey, isVisible] of Object.entries(configs)) {
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

const copyPreviousMonthConfigs = async (req, res) => {
  const { periodo } = req.body
  if (!periodo) return res.status(400).json({ error: 'Periodo requerido' })

  // 1. Calcular el mes anterior (Ej: de "2026-05" a "2026-04")
  const [year, month] = periodo.split('-')
  let prevYear = parseInt(year)
  let prevMonth = parseInt(month) - 1

  if (prevMonth === 0) {
    prevMonth = 12
    prevYear -= 1
  }

  const periodoAnterior = `${prevYear}-${String(prevMonth).padStart(2, '0')}`

  try {
    const connection = await pool.getConnection()

    // 2. Buscar si el mes anterior tiene configuraciones guardadas
    const [prevConfigs] = await connection.query('SELECT * FROM report_configs WHERE periodo = ?', [periodoAnterior])

    if (prevConfigs.length === 0) {
      connection.release()
      return res.status(404).json({ error: 'No hay configuraciones en el mes anterior para copiar.' })
    }

    // 3. Copiar cada registro al mes actual
    for (const row of prevConfigs) {
      await connection.query(
        `INSERT INTO report_configs (periodo, red_social, config_key, is_visible) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE is_visible = VALUES(is_visible)`,
        [periodo, row.red_social, row.config_key, row.is_visible],
      )
    }

    connection.release()
    res.json({ message: 'Configuración copiada con éxito' })
  } catch (error) {
    console.error('Error en copyPreviousMonthConfigs:', error)
    res.status(500).json({ error: 'Error interno al copiar la configuración.' })
  }
}

// 🚀 Función auxiliar para verificar si un periodo está bloqueado
const checkIfPeriodIsLocked = async periodo => {
  try {
    const [rows] = await pool.query("SELECT is_visible FROM report_configs WHERE periodo = ? AND red_social = 'general' AND config_key = 'is_locked'", [periodo])
    // Si existe el registro y su valor es 1 (true), entonces está bloqueado
    return rows.length > 0 && rows[0].is_visible === 1
  } catch (error) {
    console.error('Error al verificar bloqueo del periodo:', error)
    return false
  }
}

// No olvides exportar la nueva función:
module.exports = { getConfigs, updateConfigs, copyPreviousMonthConfigs }

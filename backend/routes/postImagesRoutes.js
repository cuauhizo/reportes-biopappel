const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { pool } = require('../utils/db')

// Creamos la carpeta físicamente si no existe
const uploadDir = path.join(__dirname, '../uploads/posts')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 1. CAMBIO MAESTRO: Usamos MEMORY STORAGE en lugar de DISK STORAGE
// Esto guarda el archivo pesado en RAM momentáneamente para que Sharp lo procese.
const storage = multer.memoryStorage()

// 2. Definimos el FILTRO DE SEGURIDAD (Solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    // Rechazamos el archivo y lanzamos un error
    cb(new Error('Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP.'), false)
  }
}

// 3. Inicializamos MULTER uniendo Storage + Filtro
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // límite a 10MB porque algunas capturas Retina de Mac superan los 5MB
  limits: { fileSize: 10 * 1024 * 1024 },
})

// === RUTAS ===

// 1. OBTENER todas las imágenes personalizadas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM post_images')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 2. SUBIR, OPTIMIZAR y guardar la imagen de un post
router.post('/', upload.single('image'), async (req, res) => {
  const { post_id } = req.body

  if (!req.file) return res.status(400).send('No se subió ninguna imagen')
  if (!post_id) return res.status(400).send('Falta el ID del post (post_id)')

  try {
    // 🚀 OBLIGAMOS a que el formato final sea siempre .webp, sin importar qué subió el usuario
    const filename = `${post_id}.webp`
    const outputPath = path.join(uploadDir, filename)

    // ✨ MAGIA DE SHARP: Aplastamos el peso de la imagen
    await sharp(req.file.buffer)
      .resize({
        width: 800, // Máximo 800px de ancho (suficiente para verse nítido en el reporte)
        withoutEnlargement: true, // Si suben una imagen más pequeña de 800px, no la pixela
      })
      .webp({ quality: 80 }) // 80% de calidad WebP (equilibrio perfecto visual/peso)
      .toFile(outputPath)

    // La ruta pública que usará el frontend para ver la imagen
    const imageUrl = `/uploads/posts/${filename}`

    // Guardamos en la base de datos de MySQL
    await pool.query('INSERT INTO post_images (post_id, image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)', [post_id, imageUrl])

    res.json({ message: 'Imagen optimizada y guardada con éxito', image_url: imageUrl })
  } catch (error) {
    console.error('Error al optimizar la imagen:', error)
    res.status(500).json({ error: error.message })
  }
})

// RUTA TEMPORAL PARA OPTIMIZAR IMÁGENES VIEJAS (LEGACY)
router.get('/optimize-legacy', async (req, res) => {
  try {
    // 1. Traemos todas las imágenes de la base de datos
    const [rows] = await pool.query('SELECT * FROM post_images')
    let optimizadas = 0

    for (const row of rows) {
      const oldUrl = row.image_url

      // Si la imagen ya es .webp, la ignoramos y pasamos a la siguiente
      if (oldUrl.endsWith('.webp')) continue

      // 2. Construimos las rutas físicas de los archivos
      const oldFilename = path.basename(oldUrl)
      const oldFilePath = path.join(uploadDir, oldFilename)
      const newFilename = `${row.post_id}.webp`
      const newFilePath = path.join(uploadDir, newFilename)

      // 3. Verificamos que el archivo original aún exista en el disco duro
      if (fs.existsSync(oldFilePath)) {
        // Magia de Sharp: Leemos el archivo viejo, lo aplastamos y lo guardamos como .webp
        await sharp(oldFilePath).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(newFilePath)

        // 4. Actualizamos la base de datos con la nueva URL
        const newUrl = `/uploads/posts/${newFilename}`
        await pool.query('UPDATE post_images SET image_url = ? WHERE post_id = ?', [newUrl, row.post_id])

        // 5. Destruimos la imagen original pesada para liberar espacio
        fs.unlinkSync(oldFilePath)
        optimizadas++
      }
    }

    res.json({
      message: '¡Limpieza completada!',
      detalles: `Se optimizaron y reemplazaron ${optimizadas} imágenes antiguas.`,
    })
  } catch (error) {
    console.error('Error optimizando imágenes legacy:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

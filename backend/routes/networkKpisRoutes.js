const express = require('express')
const router = express.Router()
const kpisController = require('../controllers/networkKpisController')

router.get('/', kpisController.getNetworkKpis)
router.put('/', kpisController.updateNetworkKpis)
router.get('/historical', kpisController.getHistorical)
router.put('/historical', kpisController.updateHistorical)

module.exports = router

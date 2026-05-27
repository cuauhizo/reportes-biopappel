const express = require('express')
const router = express.Router()
const configController = require('../controllers/configController')

router.get('/', configController.getConfigs)
router.put('/', configController.updateConfigs)
router.post('/copy-previous', configController.copyPreviousMonthConfigs)

module.exports = router

const express = require('express')
const controller = require('../controllers/analytics')
const router = express.Router()

//localhost:5000/api/auth/login
router.post('/overview',controller.overview)

//localhost:5000/api/auth/register
router.post('/analytics',controller.analytics)
module.exports = router
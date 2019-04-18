const express = require('express')
const router = express.Router()
const auth = require('../controller/auth')

/**
 * /auth/...
 */
router.post('/token', auth.authToken)
router.post('/google', auth.google)

module.exports = router

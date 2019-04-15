const express = require('express')
const router = express.Router()
const auth = require('../controller/auth')

/**
 * /auth/...
 */
router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/google', auth.google)

module.exports = router

const express = require('express')
const router = express.Router()
const auth = require('../controller/auth')

/**
 * /auth/...
 */
router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/logout', auth.logout)
router.post('/google', auth.googleSignIn)

module.exports = router

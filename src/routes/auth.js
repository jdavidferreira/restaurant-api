const express = require('express')
const router = express.Router()
const auth = require('../controller/auth')

router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/logout', auth.logout)
router.get('/google', auth.googleSignIn)
router.get('/google/callback', auth.googleSignInCallback)

module.exports = router

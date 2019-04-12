const express = require('express')
const router = express.Router()
const user = require('../controller/user')

/**
 * /user/...
 */
router.post('/user', user.register)
router.post('/user/:id/change_password', user.changePassword)

module.exports = router

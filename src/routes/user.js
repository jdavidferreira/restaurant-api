const express = require('express')
const router = express.Router()
const user = require('../controller/user')

/**
 * /user/...
 */
router.post('/', user.create)
router.post('/:id/change_password', user.changePassword)

module.exports = router

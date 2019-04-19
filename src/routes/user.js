const express = require('express')
const router = express.Router()
const user = require('../controller/user')
const restaurant = require('../controller/restaurant')
const passport = require('passport')

/**
 * /user/...
 */
router.post('/', user.create)

/**
 * Next routes require authorization
 */
router.use(passport.authenticate('jwt', { session: false }))

router.post('/:id/change_password', user.changePassword)
router.get('/:id/restaurant', restaurant.findByUser)

module.exports = router

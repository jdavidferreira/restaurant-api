const express = require('express')
const router = express.Router()
const restaurant = require('../controller/restaurant')
const passport = require('passport')

/**
 * /restaurant/...
 */
router.get('/', restaurant.findAll)
router.get('/:id', restaurant.findById)

/**
 * Next routes require authorization
 */
router.use(passport.authenticate('jwt', { session: false }))

router.post('/', restaurant.create)
router.patch('/:id/comment', restaurant.comment)

module.exports = router

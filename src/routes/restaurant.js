const express = require('express')
const router = express.Router()
const restaurant = require('../controller/restaurant')
const passport = require('passport')
const upload = require('../services/image-upload-aws-s3')
/**
 * /restaurant/...
 */
router.get('/', restaurant.findAll)
router.get('/:id', restaurant.findById)

/**
 * Next routes require authorization
 */
router.use(passport.authenticate('jwt', { session: false }))

router.post('/', upload.array('photos', 6), restaurant.create)
router.patch(':id', restaurant.update)
router.delete('/:id', restaurant.delete)
router.patch('/:id/comment', restaurant.comment)

module.exports = router

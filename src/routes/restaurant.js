const express = require('express')
const router = express.Router()
const restaurant = require('../controller/restaurant')
const requireUser = require('../middlewares').requireUser

router.get('/', restaurant.findAll)
router.get('/:id', restaurant.findById)

router.use('/', requireUser) // next routes require to be authenticated

router.post('/', restaurant.create)
router.patch('/:id/comment', restaurant.comment)

module.exports = router

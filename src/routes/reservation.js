const express = require('express')
const router = express.Router()
const reservation = require('../controller/reservation')
const requireUser = require('../middleware').requireUser

router.use('/', requireUser) // next routes require to be authenticated

router
  .route('/')
  .get(reservation.findAllByUser)
  .post(reservation.create)

router
  .route('/:id')
  .get(reservation.findById)
  .patch(reservation.update)
  .delete(reservation.delete)

module.exports = router

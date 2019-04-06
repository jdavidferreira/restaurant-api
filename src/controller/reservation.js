const mongoose = require('mongoose')
const Reservation = mongoose.model('Reservation')

exports.findAllByRestaurant = async (req, res) => {
  try {
    let reservations = await Reservation.find({
      restaurant: req.body.restaurantId
    })

    res.json(reservations)
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.findAllByUser = async (req, res) => {
  try {
    let reservations = await Reservation.find({
      user: res.locals.userId
    })

    res.json(reservations)
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.findById = async (req, res) => {
  try {
    let reservation = await Reservation.findOne({ _id: req.params.id })

    res.json(reservation)
  } catch (e) {
    res.status(422).send(e)
  }
}

exports.create = async (req, res) => {
  const reservation = {
    user: res.locals.userId,
    restaurant: req.body.restaurantId,
    status: 'REQUESTED',
    numberOfPersons: req.body.numberOfPersons || 1,
    arrivalDateTime: req.body.arrivalDateTime
  }

  try {
    let created = await Reservation.create(reservation)

    res.json(created)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.update = async (req, res) => {
  const reservationData = {
    status: req.body.status,
    numberOfPersons: req.body.numberOfPersons || 1,
    arrivalDateTime: req.body.arrivalDateTime
  }

  try {
    await Reservation.updateOne({ _id: req.params.id }, reservationData)

    res.status(204).json()
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.delete = async (req, res) => {
  try {
    await Reservation.deleteOne({ _id: req.params.id })

    res.status(204).json()
  } catch (err) {
    res.status(500).send(err)
  }
}

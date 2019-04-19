const mongoose = require('mongoose')
const Restaurant = mongoose.model('Restaurant')

exports.findAll = wrapAsync(async (req, res) => {
  let restaurants = await Restaurant.find()

  res.json(restaurants)
})

exports.findById = wrapAsync(async (req, res) => {
  let restaurant = await Restaurant.findOne({ _id: req.params.id })

  res.json(restaurant)
})

exports.findByUser = wrapAsync(async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(403).json({ message: 'Identification error' })
  }

  let restaurants = await Restaurant.find({ user: req.user.id })

  res.json(restaurants)
})

exports.create = wrapAsync(async (req, res) => {
  const restaurant = {
    name: req.body.name,
    address: req.body.address,
    user: req.user.id,
    categories: [],
    photos: []
  }

  let created = await Restaurant.create(restaurant)

  res.json(created)
})

exports.comment = wrapAsync(async (req, res) => {
  let updated = await Restaurant.updateOne(
    {
      _id: req.params.id
    },
    {
      $push: { text: req.body.comment, by: res.body.userId }
    }
  )

  res.json(updated)
})

exports.update = wrapAsync(async (req, res) => {
  const restaurant = {
    name: req.body.name,
    address: req.body.address,
    user: req.user.id,
    categories: [],
    photos: []
  }

  let created = await Restaurant.update(
    { _id: req.params.id },
    { $set: restaurant }
  )

  res.json(created)
})

exports.delete = wrapAsync(async (req, res) => {
  await Restaurant.deleteOne({ id: req.params.id })

  res.status(204).json()
})

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next)
  }
}

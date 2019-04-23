const mongoose = require('mongoose')
const Restaurant = mongoose.model('Restaurant')

exports.findAll = async (req, res) => {
  let restaurants = await Restaurant.find()

  res.json(restaurants)
}

exports.findById = async (req, res) => {
  let restaurant = await Restaurant.findOne({ _id: req.params.id })

  res.json(restaurant)
}

exports.findByUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(403).json({ message: 'Identification error' })
  }

  let restaurants = await Restaurant.find({ user: req.user.id })

  res.json(restaurants)
}

exports.create = async (req, res) => {
  const restaurant = {
    name: req.body.name,
    address: req.body.address,
    user: req.user.id,
    categories: JSON.parse(req.body.categories),
    photos: req.files.map(f => {
      const obj = {}
      obj.uri = f.location
      return obj
    })
  }

  let created = await Restaurant.create(restaurant)

  res.json({ id: created.id })
}

exports.comment = async (req, res) => {
  let updated = await Restaurant.updateOne(
    {
      _id: req.params.id
    },
    {
      $push: { text: req.body.comment, by: res.body.userId }
    }
  )

  res.json(updated)
}

exports.update = async (req, res) => {
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
}

exports.delete = async (req, res) => {
  await Restaurant.deleteOne({ id: req.params.id })

  res.status(204).json()
}

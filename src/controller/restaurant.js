const mongoose = require('mongoose')
const Restaurant = mongoose.model('Restaurant')

exports.findAll = async (req, res) => {
  try {
    let restaurants = await Restaurant.find()

    res.json(restaurants)
  } catch (e) {
    res.status(400).json(e)
  }
}

exports.findById = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne({ _id: req.params.id })

    res.json(restaurant)
  } catch (e) {
    res.status(422).json(e)
  }
}

exports.create = async (req, res) => {
  const restaurant = {
    name: req.body.name,
    address: req.address.body,
    categories: [],
    photos: []
  }

  try {
    let created = await Restaurant.create(restaurant)

    res.json(created)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.comment = async (req, res) => {
  const data = {
    restaurantId: req.body.restaurantId,
    userId: res.locals.userId,
    comment: req.body.comment
  }

  try {
    let updated = await Restaurant.updateOne(
      {
        _id: data.restaurantId
      },
      {
        $push: { text: data.comment, by: data.userId }
      }
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json(err)
  }
}

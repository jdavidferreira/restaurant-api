const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')
const config = require('../config')

exports.register = async (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    await User.create(user)

    res.status(200).json()
  } catch (err) {
    if (err.name == 'ValidationError') {
      //what should i do???
      res.status(400).send(err)
    } else {
      res.status(500)
    }
    res.send(err)
  }
}

exports.login = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    let user = await User.authenticate(email, password)

    if (user) {
      // note: avoid saving the objectId from mongodb, create a different id, like user public id
      //we can invalidate or expire the token at specific time, more secure than expire cookie
      let token = await jwt.sign(
        { userId: user._id },
        config.SECRET_KEY || 'secretCode',
        { expiresIn: '30m' }
      )

      // or we can expire cookie at specific time
      res.cookie('token', token, {
        expires: new Date(Date.now() + 60000 * 30),
        httpOnly: true
      })
      res.status(200).json()
    } else {
      res
        .status(400)
        .json({ error: 'Authentication failed. Wrong email or password.' })
    }
  } catch (err) {
    res.status(400).send({ error: 'Authentication failed.' })
  }
}

exports.logout = async (req, res) => {
  res.clearCookie('token')
  res.status(200).json()
}

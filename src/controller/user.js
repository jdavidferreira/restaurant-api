const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.create = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    await User.create({ email, password })

    res.status(200).json()
  } catch (err) {
    // console.error(Object.keys(err.errors).map(e => err.errors[e].message))
    if (err.name == 'ValidationError') {
      //todo: show error message in response
      res.status(400)
    } else {
      res.status(500)
    }
    res.send(err)
  }
}

exports.changePassword = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    await User.findOneAndUpdate({ email }, { password })

    res.status(200).json()
  } catch (err) {
    res.status(500).send(err)
  }
}

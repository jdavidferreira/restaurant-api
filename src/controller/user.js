const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.create = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.create({ email, password })

  res.status(200).json({ id: user.id })
}

exports.changePassword = async (req, res) => {
  const id = req.params.id
  let password = req.body.password

  await User.updateOne({ _id: id }, { $set: { password } })

  res.status(204).end()
}

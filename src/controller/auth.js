const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    await User.create(user)

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

exports.login = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    let user = await User.authenticate(email, password)

    if (user) {
      const authToken = await jwt.sign(
        { userId: user.id },
        process.env.SECRET_KEY,
        {
          expiresIn: '30m'
        }
      )

      res.status(200).json({ authToken })
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

exports.googleSignIn = async (req, res) => {
  const urlEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  const clientId = process.env.CLIENT_ID
  const responseType = 'code'
  const scope = 'profile+email'
  const redirectUri =
    'https://restaurant-api-123.herokuapp.com/auth/google/callback'

  //request token
  res.redirect(
    `${urlEndpoint}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`
  )
}

exports.googleSignInCallback = async (req, res) => {
  const email = req.user.email

  try {
    let user = await User.findOne({ email }) //get that user

    if (!user) {
      //if not exists
      const password = Math.random()
        .toString(36)
        .slice(-8)

      user = await User.create({ email, password }) //create user
    }

    const authToken = await jwt.sign(
      { userId: user.id },
      process.env.SECRET_KEY,
      {
        expiresIn: '30m'
      }
    )
    res.status(200).json(authToken)
  } catch (error) {
    res.status(500)
  }
}

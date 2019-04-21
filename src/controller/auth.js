const mongoose = require('mongoose')
const User = mongoose.model('User')
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const passport = require('passport')

exports.authToken = async (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(400).json(err || info)
    }

    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err)
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const auth_token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: '1h'
      })

      return res.json({ auth_token })
    })
  })(req, res)
}

exports.google = async (req, res) => {
  const code = req.body.code
  //exchange for access token
  let response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: JSON.stringify({
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.CALLBACK_URI,
      grant_type: 'authorization_code'
    })
  })
  response = await response.json()
  //token response
  const accessToken = response.access_token
  const personFields = 'names,emailAddresses'

  let data = await fetch(
    `https://people.googleapis.com/v1/people/me?personFields=${personFields}&access_token=${accessToken}`
  )
  data = await data.json()

  const email = data.emailAddresses[0].value

  let user = await User.findOne({ email }) //get that user

  if (!user) {
    //if not existS
    const password = Math.random() //random password
      .toString(36)
      .slice(-8)
    user = await User.create({ email, password }) //create user
  }
  const auth_token = await jwt.sign(
    { userId: user.id },
    process.env.SECRET_KEY,
    {
      expiresIn: '30m'
    }
  )
  res.json({ auth_token })
}

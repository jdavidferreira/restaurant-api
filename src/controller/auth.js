const mongoose = require('mongoose')
const User = mongoose.model('User')
const config = require('../config')
const fetch = require('node-fetch')
const axios = require('axios')

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
      await saveJwtTokenCookie(res, user.id)

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

exports.googleSignIn = async (req, res) => {
  const urlEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  const clientId =
    '794981758452-mh784g8d58m2ilehv6becr2jl787ji9b.apps.googleusercontent.com'
  const responseType = 'code'
  const scope = 'profile+email'
  const redirectUri = 'http://localhost:3001/auth/google/callback'

  //request token
  res.redirect(
    `${urlEndpoint}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`
  )
}

exports.googleSignInCallback = async (req, res) => {
  const error = req.query.error

  if (error) {
    //cancel
  }
  //authorization code
  const code = req.query.code

  const body = {
    code: code,
    client_id:
      '794981758452-mh784g8d58m2ilehv6becr2jl787ji9b.apps.googleusercontent.com',
    client_secret: 'ulXGbWdefkQsYgJ0pRhIZ75W',
    redirect_uri: 'http://localhost:3001/auth/google/callback',
    grant_type: 'authorization_code'
  }
  //exchange for access token
  let response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: JSON.stringify(body)
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
  const randomPassword = Math.random()
    .toString(36)
    .slice(-8)

  let user = {
    email,
    password: randomPassword
  }

  try {
    user = await User.create(user) //create user
  } catch (error) {
    if (error.code === 11000) {
      //if already exists
      user = await User.findOne({ email }) //get that user
    }
  }

  saveJwtTokenCookie(res, user.id) //and "login"

  res.status(200).json()
}

exports.googleSignInCallbackAxios = async (req, res) => {
  const error = req.query.error

  if (error) {
    //cancel
  }
  //authorization code
  const code = req.query.code

  const body = {
    code: code,
    client_id:
      '794981758452-mh784g8d58m2ilehv6becr2jl787ji9b.apps.googleusercontent.com',
    client_secret: 'ulXGbWdefkQsYgJ0pRhIZ75W',
    redirect_uri: 'http://localhost:3001/auth/google/callback',
    grant_type: 'authorization_code'
  }
  //exchange for access token
  let response = await axios.post('https://oauth2.googleapis.com/token', body)

  //token response
  const accessToken = response.data.access_token
  const personFields = 'names,emailAddresses'

  let data = await axios.get(
    `https://people.googleapis.com/v1/people/me?personFields=${personFields}&access_token=${accessToken}`
  )
  console.log(data.data)
  res.end()
}

const saveJwtTokenCookie = (res, userId) => {
  const jwt = require('jsonwebtoken')
  // note: avoid saving the objectId from mongodb, create a different id, like user public id
  //we can invalidate or expire the token at specific time, more secure than expire cookie
  let token = jwt.sign({ userId }, config.SECRET_KEY, {
    expiresIn: '30m'
  })

  // or we can expire cookie at specific time
  res.cookie('token', token, {
    expires: new Date(Date.now() + 60000 * 30),
    httpOnly: true
  })
}

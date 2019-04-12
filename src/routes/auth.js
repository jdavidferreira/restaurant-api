const express = require('express')
const router = express.Router()
const auth = require('../controller/auth')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

/**
 * /auth/...
 */
router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/logout', auth.logout)

// Strategy config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URI
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      done(null, { email: profile.emails[0].value })
    }
  )
)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile email'] // Used to specify the required data
  })
)
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false
  }),
  auth.googleSignInCallback
)

module.exports = router

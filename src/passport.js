const passport = require('passport')
const passportJwt = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt
const User = require('./model/User')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })

        if (!user) {
          return done(null, false, { message: 'Incorrect email' })
        }
        const isValid = await user.validatePassword(password)

        if (!isValid) {
          return done(null, false, { message: 'Incorrect  password' })
        }
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromBodyField('auth_token'),
        ExtractJwt.fromUrlQueryParameter('auth_token')
      ]),
      secretOrKey: process.env.SECRET_KEY
    },
    async (jwtPayload, done) => {
      try {
        //find the user in db if needed.
        //This functionality may be omitted if everything needed is soored in JWT payload.
        const user = await User.findById(jwtPayload.user.id)

        if (user) {
          return done(null, user)
        } else {
          throw new Error('User does not exist.')
        }
      } catch (error) {
        return done(error)
      }
    }
  )
)

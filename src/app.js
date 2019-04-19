const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')

const app = express()
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
})
mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(' ')
  })
)
app.use(passport.initialize())

// Instanciate Models
require('./model/User')
require('./model/Restaurant')
require('./model/Reservation')
// Other stuff
require('./passport')

//Routes
const restaurantRoute = require('./routes/restaurant')
const reservationRoute = require('./routes/reservation')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
app.use('/restaurant', restaurantRoute)
app.use('/reservation', reservationRoute)
app.use('/auth', authRoute)
app.use('/user', userRoute)

const middleware = require('./middleware')
app.use(middleware.mongoErrorHandler)

module.exports = app

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const config = require('./config')

const app = express()

// MongoDB Connection
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
})
mongoose.connection.on('error', e => console.error(e))

// Instanciate Models
require('./model/User')
require('./model/Restaurant')
require('./model/Reservation')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cors())
app.use(cookieParser())

//Routes
const restaurantRoute = require('./routes/restaurant')
const reservationRoute = require('./routes/reservation')
const authRoute = require('./routes/auth')
app.use('/restaurant', restaurantRoute)
app.use('/reservation', reservationRoute)
app.use('/auth', authRoute)

module.exports = app

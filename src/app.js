const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const config = require('./config')

const app = express()

// MongoDB Connection
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
mongoose.connection.on('error', e => console.error(e))

// Instanciate Models
require('./model/User')
require('./model/Restaurant')
require('./model/Reservation')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//Routes
const restaurantRoute = require('./routes/restaurant')
const reservationRoute = require('./routes/reservation')
const authRoute = require('./routes/auth')
app.use(restaurantRoute)
app.use(reservationRoute)
app.use(authRoute)

module.exports = app

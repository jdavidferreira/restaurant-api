const mongoose = require('mongoose')

const ReservationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'IN PROGRESS', 'FINISHED'],
      required: true
    },
    number_of_persons: {
      type: Number,
      alias: 'numberOfPersons',
      required: true
    },
    arrival_date_time: {
      type: Date,
      alias: 'arrivalDateTime',
      required: true
    }
  },
  {
    collection: 'reservation',
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

module.exports = mongoose.model('Reservation', ReservationSchema)

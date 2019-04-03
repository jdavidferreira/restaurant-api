const mongoose = require('mongoose')

const RestaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    categories: [
      {
        name: {
          type: String,
          trim: true
        }
      }
    ],
    comments: [
      {
        text: {
          type: String,
          trim: true
        },
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      }
    ],
    photos: [
      {
        uri: {
          type: String,
          required: true,
          trim: true
        }
      }
    ]
  },
  {
    collection: 'restaurant',
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

module.exports = mongoose.model('Restaurant', RestaurantSchema)

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    }
  },
  { collection: 'user', versionKey: false }
)

UserSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.statics.authenticate = async function(email, password) {
  // buscamos el usuario utilizando el email
  let user = await this.findOne({ email })

  if (user) {
    // si existe comparamos la contraseña
    let check = await bcrypt.compare(password, user.password)

    return check ? user : null
  }

  return null
}

//encrypt password on first save
UserSchema.pre('save', async function(next) {
  try {
    this.password = await bcrypt.hash(this.password, 8)
  } catch (err) {
    console.log('err pre save')
    return next(err)
  }

  next()
})

// //encrypt password (if was modified) before updateOne
UserSchema.pre('updateOne', async function(next) {
  const password = this.getUpdate().$set.password

  if (!password) {
    return next()
  }
  try {
    const hash = bcrypt.hashSync(password, 8)
    this.getUpdate().$set.password = hash
    next()
  } catch (error) {
    return next(error)
  }
})

UserSchema.set('toObject', { virtuals: true }) // retrieve the "id" virtual when calling user.toObject

//removes "_id" and "password" fields
UserSchema.methods.toJSON = function() {
  var user = this.toObject()
  delete user._id
  delete user.password
  return user
}

module.exports = mongoose.model('User', UserSchema)

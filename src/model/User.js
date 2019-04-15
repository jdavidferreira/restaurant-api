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

module.exports = mongoose.model('User', UserSchema)

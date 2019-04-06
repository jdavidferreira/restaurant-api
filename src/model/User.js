const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const PersonSchema = mongoose.Schema(
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

PersonSchema.statics.authenticate = async function(email, password) {
  // buscamos el usuario utilizando el email
  let user = await this.findOne({ email })

  if (user) {
    // si existe comparamos la contraseña
    let check = await bcrypt.compare(password, user.password)

    return check ? user : null
  }

  return null
}

PersonSchema.pre('save', async function(next) {
  try {
    this.password = await bcrypt.hash(this.password, 8)
  } catch (err) {
    console.log('err')
    return next(err)
  }

  next()
})

module.exports = mongoose.model('User', PersonSchema)

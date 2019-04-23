const jwt = require('jsonwebtoken')

/**
 * @deprecated
 * Use passport.
 */
exports.requireUser = async (req, res, next) => {
  const authToken = req.cookies.auth_token

  if (authToken) {
    try {
      const decoded = await jwt.verify(authToken, process.env.SECRET_KEY)

      res.locals.userId = decoded.userId

      next()
    } catch (error) {
      res.status(401).json({ error: 'Invalid authorization token' })
    }
  } else {
    res.status(401).json({ error: 'Not authorized' })
  }
}

exports.mongoErrorHandler = (error, req, res, next) => {
  let code = 400
  let message = 'Unknown error'

  switch (error.name) {
    case 'ValidationError':
      //this just prevent "[Collection's name] validation failed:" part of the error.message default
      message = Object.keys(error.errors)
        .map(e => `${error.errors[e].path} : ${error.errors[e].message}`)
        .join(', ')
      break
    case 'MongoError':
      if (error.code === 11000) {
        code = 409
        message = 'Already exists in database'
      } else {
        message = error.message
      }
      break
    case 'MulterError':
      message = error.message
      console.error(error)
      break
    default:
      message = error.message
      console.error(error)
      break
  }

  res.status(code).json({ message })
}

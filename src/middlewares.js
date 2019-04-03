const jwt = require('jsonwebtoken')
const config = require('./config')

exports.requireUser = async (req, res, next) => {
  const token = req.cookies.token

  if (token) {
    try {
      const decoded = await jwt.verify(token, config.SECRET_KEY || 'secretCode')

      res.locals.userId = decoded.userId

      next()
    } catch (error) {
      res.status(401).json({ error: 'Invalid authorization token' })
    }
  } else {
    res.status(401).json({ error: 'Not authorized' })
  }
}

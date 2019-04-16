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

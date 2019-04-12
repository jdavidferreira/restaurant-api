const jwt = require('jsonwebtoken')

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

//should prevent oauth authentication if theire already logged in some user
// needs to be reviewed
exports.rejectIfLogged = async (req, res, next) => {
  const authToken = req.cookies.auth_token

  if (authToken) {
    try {
      const decoded = await jwt.verify(authToken, process.env.SECRET_KEY)

      res.locals.userId = decoded.userId

      res.status(409).json({ error: 'Already looged in.' }) //409 = Conflict
    } catch (_error) {
      next()
    }
  } else {
    next()
  }
}

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant',
  SECRET_KEY: process.env.SECRET_KEY || 'secretCode',
  CORS_ORIGIN: 'http://localhost:3000'
}

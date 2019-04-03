module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant',
  SECRET_CODE: process.env.SECRET_CODE || 'secretCode'
}

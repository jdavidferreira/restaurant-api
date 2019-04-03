const app = require('./app')
const config = require('./config')

app.listen(config.PORT, err => {
  if (err) {
    process.exit(1)
  }
  console.log('Server On!')
})

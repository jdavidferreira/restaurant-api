const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

aws.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-2'
})

const s3 = new aws.S3()

const fileFilter = (req, file, next) => {
  const isPhoto = file.mimetype.startsWith('image/')
  if (isPhoto) {
    next(null, true)
  } else {
    next(new Error('Invalid file type, only images allowed!'), false)
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 'restaurant-123-bucket',
    acl: 'public-read',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload

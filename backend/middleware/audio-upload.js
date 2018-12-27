

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const appConfig = require('../common/app-config');

const s3Config = new AWS.S3({
    accessKeyId: appConfig.AWSAccessKeyId,
    secretAccessKey: appConfig.AWSSecretKey,
    Bucket: appConfig.AWSBucketName
  });

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(mp3|wma)$/)) {
      return cb(new Error('Only MP3/WMA format is supported!'), false);
  } else {
    cb(null, true);
  }
};

const multerS3Config = multerS3({
    s3: s3Config,
    bucket: appConfig.AWSBucketName,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
        const filename = appConfig.audioFolder + '/' + Date.now() + "-" + name;
        cb(null, filename);
    }
});

const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
});

module.exports = upload;

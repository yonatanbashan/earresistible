const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};


const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const appConfig = require('../common/app-config');

const s3Config = new AWS.S3({
    accessKeyId: appConfig.AWSAccessKeyId,
    secretAccessKey: appConfig.AWSSecretKey,
    Bucket: appConfig.AWSBucketName
  });

const fileFilter = (req, file, cb) => {
    if (MIME_TYPE_MAP[file.mimetype]) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

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
        const ext = MIME_TYPE_MAP[file.mimetype];
        const filename = appConfig.imagesFolder + '/' + Date.now() + "-" + name;
        cb(null, filename);
    }
});

const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
});

module.exports = upload;

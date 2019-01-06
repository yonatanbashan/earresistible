const AWS = require('aws-sdk');
const appConfig = require('../common/app-config');




deleteFile = function(filename) {

  AWS.config.credentials = new AWS.Credentials({
    accessKeyId: appConfig.AWSAccessKeyId,
    secretAccessKey: appConfig.AWSSecretKey
  });
  const s3 = new AWS.S3();

  const params = {
    Bucket: appConfig.AWSBucketName,
    Key: filename
  };

  return new Promise(function(resolve, reject) {
    s3.deleteObject(params, function (err, data) {
      if (data) {
        resolve(data);
      } else {
        console.log('Failed deleting file. Params:', params)
        reject(new Error('Deleting file failed. Error:', err));
      }
    });
  });

}

module.exports = deleteFile;

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
  s3.deleteObject(params, function (err, data) {
    if (data) {
      console.log('Success!');
      // TODO: Deleted successfully
    } else {
      console.log('Fail!');
      // TODO: Deletion failed
    }
  });

}

module.exports = deleteFile;

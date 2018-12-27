const appConfig = require('./app-config');

exports.getRelativePath = function(fn) {

  storageRoot = appConfig.AWSAddress;
  fnSegments = fn.split(storageRoot);
  if(fnSegments.length > 1) {
    if(fnSegments[1][0] === '/') {
      fnSegments[1] = fnSegments[1].slice(1);
    }
    return fnSegments[1];
  } else {
    storageRoot = appConfig.AWSAddressSimple;
    fnSegments = fn.split(storageRoot);
  }

  if(fnSegments.length > 1) {
    if(fnSegments[1][0] === '/') {
      fnSegments[1] = fnSegments[1].slice(1);
    }
    return fnSegments[1];
  } else {
    return fnSegments[0];
  }

}

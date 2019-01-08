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

exports.uniqueByText = function(array) {
  let flags = {};
  const newArray = array.filter(function(element) {
      if (flags[element.text]) {
          return false;
      }
      flags[element.text] = true;
      return true;
  });
  return newArray;
}

exports.getMatchingScore = function(refTags, targetTags) {
  score = 0;
  maxTargetTag = (Math.max.apply(Math, targetTags.map(tag => {
    return tag.count;
    })));
  maxRefTag = (Math.max.apply(Math, refTags.map(tag => {
    return tag.count;
    })));
  refTags.forEach(tag => {
    existingTag = targetTags.filter(ttag => tag.text === ttag.text);
    if (existingTag.length > 0) {
      score += (existingTag[0].count / maxTargetTag) / (tag.count / maxRefTag);
    }
  });
  return score;
}

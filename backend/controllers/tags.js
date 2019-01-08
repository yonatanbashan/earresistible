const Tag = require('../models/tag');
const User = require('../models/user');
const Profile = require('../models/profile');
const appConfig = require('../common/app-config');
const aux = require('../common/auxiliary')


exports.searchTags = async (req, res, next) => {

  let searchRegex;
  const text = req.query.text.toLowerCase();
  try {
    searchRegex = `^${text}`;
    let userTags = await Tag.find({ userId: req.query.userId, text: { $regex: searchRegex } });

    // Add also non-starting tags
    if(userTags.length < req.query.amount) {
      searchRegex = `${text}`;
      let moreTags = await Tag.find({ userId: req.query.userId, text: { $regex: searchRegex } });
      userTags = userTags.concat(moreTags);
      userTags = aux.uniqueByText(userTags);
    }

    // Search outside user's scope
    if(userTags.length < req.query.amount) {
      searchRegex = `^${text}`;
      let moreTags = await Tag.find( { text: { $regex: searchRegex } });
      userTags = userTags.concat(moreTags);
      userTags = aux.uniqueByText(userTags);
    }

    // Search outside user's scope
    if(userTags.length < req.query.amount) {
      searchRegex = `${text}`;
      let moreTags = await Tag.find( { text: { $regex: searchRegex } });
      userTags = userTags.concat(moreTags);
      userTags = aux.uniqueByText(userTags);
    }


    userTags.sort((a,b) => {
      return b.count - a.count;
    });
    if (userTags.length > req.query.amount) {
      userTags = userTags.slice(0, req.query.amount);
    }
    res.status(200).json({
      message: `Successfully fetched ${req.query.amount} search tags for query text ${text}`,
      tags: userTags
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to search for user tags', error: err });
  }

}

exports.getTopTags = async (req, res, next) => {
  try {
    let topTags = await Tag.find({ userId: req.query.userId });
    topTags.sort((a,b) => {
      return b.count - a.count;
    });
    if (topTags.length > req.query.amount) {
      topTags = topTags.slice(0, req.query.amount);
    }
    res.status(200).json({
      message: `Successfully fetched ${req.query.amount} of the top tags for user ${req.query.userId}`,
      tags: topTags}
    );
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch top user tags', error: err });
  }
}

exports.getTags = async (req, res, next) => {

  console.log(req.query);
  if (req.query.userId) {
    try {
      const tags = await Tag.find({ userId: req.query.userId });
      res.status(200).json({ message: 'User tags fetched successfully!', tags: tags });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch user tags', error: err });
    }
  } else if (req.query.text) {
    try {
      // TODO: Convert to regexp
      const tags = await Tag.find({ text: req.query.text });
      res.status(200).json({ message: `'All tags matching text ${req.query.text} fetched successfully`, tags: tags});
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch tags by text', error: err });
    }
  }

}

exports.incTag = async (req, res, next) => {

  console.log(req.body);

  let tag;
  const text = req.body.text.toLowerCase();
  try {
    tag = await Tag.findOne({userId: req.body.userId, text: text})
  } catch (err) {
    res.status(500).json({ message: 'Failed to increment taggg count', error: err });
  }

  if(!tag) {
    next();
  } else {
    try {
      const incResult = await Tag.findByIdAndUpdate(tag._id, { count: tag.count + 1 });
      res.status(200).json({ message: 'Tag incremented successfully!', tag: incResult });
    } catch (err) {
      res.status(500).json({ message: 'Failed to increment tag count', error: err });
    }
  }


}

exports.addTag = async (req, res, next) => {

  const text = req.body.text.toLowerCase();

  const tag = new Tag({
    text: text,
    count: 1,
    userId: req.body.userId,
  });

  try {
    const newTag = await tag.save();
    res.status(200).json({ message: 'Tag added successfully!', tag: newTag });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add new tag', error: err });
  }

}


exports.getSimilarArtists = async (req, res, next) => {

  let matchingUserIds = [];
  let tagTexts = [];
  let refTagsAmount = req.query.refTagsAmount;
  let maxMatches = req.query.maxMatches;

  let userScorePairs = [];
  let finalMatchedUserIds = [];

  // try {

    // Get the reference user's top tags
    let refTags = await Tag.find({ userId: req.query.userId });
    refTags.sort((a,b) => {
      return b.count - a.count;
    });
    if(refTags.length > refTagsAmount) {
      refTags = refTags.slice(0, refTagsAmount);
    }
    refTags.forEach(tag => {
      tagTexts.push(tag.text);
    });

    // Get potential matching users from matching tags
    const matchingTags = await Tag.find( { text: { $in: tagTexts } });
    matchingTags.forEach(tag => {
      const ID = '' + tag.userId; // For some reason nothing works without this...
      if ( !matchingUserIds.includes(ID) && (ID !== req.query.userId) ) {
        matchingUserIds.push(ID);
      }
    })

    // Get matching score for potential users
    const userTags = await Tag.find( {userId: { $in : matchingUserIds } });
    matchingUserIds.forEach(matchingUserId => {
      const thisUserTags = userTags.filter(tag => ('' + tag.userId) === matchingUserId);
      const score = aux.getMatchingScore(refTags, thisUserTags);
      userScorePairs.push({
        userId: matchingUserId,
        score: score
      });
    });

    // Sort matches by score
    userScorePairs.sort((a,b) => {
      return b.score - a.score;
    });

    // Get only small number of matches
    if(userScorePairs.length > maxMatches) {
      userScorePairs = userScorePairs.slice(0, maxMatches);
    }
    userScorePairs.forEach(userScorePair => {
      finalMatchedUserIds.push(userScorePair.userId);
    });

    // Go for genre matching if that's not enough
    if(finalMatchedUserIds.length < maxMatches) {

      numMissingProfiles = maxMatches - finalMatchedUserIds.length;

      let moreUserIds = [];
      let onlyUserIds = [];
      const refUserProfile = await Profile.findOne({ userId: req.query.userId });
      const similarGenreProfiles = await Profile.find( { genre: refUserProfile.genre });
      similarGenreProfiles.forEach(profile => {
        moreUserIds.push(profile.userId);
      });

      moreUserIds = moreUserIds.filter(id => '' + id !== req.query.userId);

      if(moreUserIds.length >= numMissingProfiles) {
        let chosenIndices = [];
        while(onlyUserIds.length < numMissingProfiles) {
          let randomIndex;
          while( chosenIndices.includes(randomIndex = Math.floor(Math.random() * moreUserIds.length)) ) {
          }
          onlyUserIds.push(moreUserIds[randomIndex]);
          chosenIndices.push(randomIndex);
        }
      } else {
        finalMatchedUserIds = finalMatchedUserIds.concat(moreUserIds);
      }

      finalMatchedUserIds = finalMatchedUserIds.concat(onlyUserIds);

    }


    const finalMatchedUsers = await User.find({_id: { $in: finalMatchedUserIds }});

    res.status(200).json({
      message: 'Successfully found matching users!',
      users: finalMatchedUsers,
      userIds: finalMatchedUserIds
    });

  // } catch (err) {
  //   res.status(500).json({ message: 'Could not get similar artists!', error: err })
  // }

}

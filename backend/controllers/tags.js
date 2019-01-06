const Tag = require('../models/tag');
const User = require('../models/user')
const appConfig = require('../common/app-config');

exports.incTag = async (req, res, next) => {

  let tag;
  const text = req.body.text.toLowercase();
  try {
    tag = await Tag.findOne({userId: req.body.userId, text: text})
    if(!tag) {
      next();
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to increment tag count', error: err });
  }

  try {
    const incResult = await Tag.findByIdAndUpdate(tag._id, { count: tag.count + 1 });
    res.status(200).json({ message: 'Tag incremented successfully!', tag: incResult });
  } catch (err) {
    res.status(500).json({ message: 'Failed to increment tag count', error: err });
  }


}

exports.addTag = async (req, res, next) => {

  const text = req.body.text.toLowercase();

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

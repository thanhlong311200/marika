const multerMedia = require("multer");
const path = require("path");
const Topic = require("../models/MediaTopic.model");
const Category = require("../models/MediaCategory.model");

const imageRegex = /\.(jpg|JPG|jpeg|JPEG|png|PNG)$/;
const audioRegex = /mp4|mp3/;

const storage = multerMedia.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../uploads`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, '_'))
  }
})

const fileFilter = async (req, file, cb) => {
  try {
    const ext = path.extname(file.originalname);
    const topic = await Topic.findById(req.body.topicId);
    if (!topic)
      return cb("topicId do not exist !");
    const cat = await Category.findById(topic._doc.categoryId);
    if (!cat)
      return cb("categoryId do not exist !");
    req.body.type = cat._doc.type;
    req.body.categoryId = cat._id.toString();
    switch (req.body.type) {
      case 'image':
        if (!imageRegex.test(ext))
          return cb('Error: urlFile value must be of type image');
        return cb(null, true);
      case 'audio':
        if (!audioRegex.test(ext))
          return cb('Error: urlFile value must be of type audio');
        return cb(null, true);
      case 'video':
        return cb(null, false);
      default:
        return cb(null, false);
    }
  } catch (error) {
    return cb('Error: upload file fail');
  }
}

module.exports = {
  storage,
  limits: {fileSize: 104857600},
  fileFilter,
}

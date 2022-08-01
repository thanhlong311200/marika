const multerMedia = require("multer");
const path = require("path");

const imageRegex = /\.(jpg|JPG|jpeg|JPEG|png|PNG)$/;

const storage = multerMedia.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../avatars`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const fileFilter = async (req, file, cb) => {
  try {
    const ext = path.extname(file.originalname);
    if (!imageRegex.test(ext))
      return cb('Error: urlFile value must be of type image');
    return cb(null, true);
  } catch (error) {
    return cb('Error: upload file fail');
  }
}

module.exports = {
  storage,
  limits: {fileSize: 26214400},
  fileFilter,
}

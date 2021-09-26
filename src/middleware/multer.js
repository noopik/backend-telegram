const multer = require('multer');
const path = require('path');
const maxSize = 1024 * 1024 * 2;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { configCloudinary } = require('./cloudinary');

cloudinary.config(configCloudinary);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Teleclone',
  },
});

const singleUpload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('avatar');

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    const message = new Error('Error: Images Only !!!');
    return cb(message);
  }
}

module.exports = { singleUpload };

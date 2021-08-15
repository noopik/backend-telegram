const multer = require('multer');
const path = require('path');
const fs = require('fs');
const short = require('short-uuid');
const maxSize = 1024 * 1024 * 2;

// START =  MULTIPLE UPLOAD
const storageMultiple = multer.diskStorage({
  destination: function(req, file, cb) {
    var dir = 'public/images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const multipleUpload = multer({
  storage: storageMultiple,
  limits: { fileSize: maxSize * 8 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
}).array('image', 8);

// END =  MULTIPLE UPLOAD

// START =  SINGLE UPLOAD
// Set storage engine
const singleStorage = multer.diskStorage({
  destination: 'public/images',
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const singleUpload = multer({
  storage: singleStorage,
  limits: { fileSize: maxSize },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('avatar');
// END =  SINGLE UPLOAD

// // Check file Type
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    const message = new Error('Error: Images Only !!!');
    return cb(message);
  }
}

module.exports = { multipleUpload, singleUpload };
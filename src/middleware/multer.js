const multer = require('multer');
const path = require('path');
const short = require('short-uuid');
const maxSize = 1024 * 1024 * 1;
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function(req, file, cb) {
    const uid = short();
    const newUid = uid.generate();
    cb(null, `${newUid}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fieldSize: maxSize }, // does'nt work!!!
});

// Error Handling Upload File
const uploadFile = async(req, res, next, field, maxCount) => {
  const singleUpload = await upload.single(field);
  const multipleUpload = upload.array(field, maxCount);

  console.log(123, singleUpload.fileFilter);

  if (!maxCount) {
    singleUpload(req, res, next, (err) => {
      if (err instanceof multer.MulterError) {
        console.log('instanceof', err);
      } else if (error) {
        console.log('instanceof', error);
        const message = new Error(error);
        message.status = 405;
        next(message);
      }
      console.log('req.file', req.file);
      // limitationSize(req, next);
      next();
    });
  } else {
    console.log(2);

    multipleUpload(req, res, (err) => {
      // console.log('req multipleUpload', req.files);
      if (err instanceof multer.MulterError) {
        console.log('instanceof', err);
        // console.log('req.files', req.files);
      } else if (err) {
        const message = new Error(err);
        message.status = 405;
        next(message);
      }
      // console.log('multipleUpload', req.files);
      limitationSize(req, next);
      next();
    });
  }
};

const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb('Error: Images Only! Extentions type must be jpeg | jpg | png | gif');
  }
};

const limitationSize = async(req, next) => {
  const filesRequest = req.file || req.files;
  let dataFileSize = [];

  if (Array.isArray(filesRequest)) {
    // If request is multiple
    filesRequest.forEach((image) => {
      dataFileSize.push({
        name: image.filename,
        size: image.size,
      });
    });
  } else {
    // Request is single
    dataFileSize.push({
      name: filesRequest.filename,
      size: filesRequest.size,
    });
  }

  dataFileSize.forEach((item) => {
    // Failed
    // console.log('item size', item.name, item.size);
    // console.log(maxSize);
    if (item.size > maxSize) {
      dataFileSize.forEach(async(item) => {
        await fs.unlinkSync(`public/images/${item.name}`);
      });
      let message = new Error('Ukuran file melebihi batas. Maksimal 2 mb');
      message.status = 400;
      next(message);
    }
  });

  next();
};

module.exports = { uploadFile };
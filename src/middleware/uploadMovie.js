const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// JIKA MENYIMPAN DATA DI CLOUDINARY
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Ticket-online",
  },
});

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/upload/movie");
//   },
//   filename(req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

// cek ekstensi dan limit

const upload = multer({ storage }).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.responese(response, 401, error.message, null);
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.responese(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingUpload;

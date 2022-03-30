const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

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

const upload = multer({ storage }).single("image");

module.exports = upload;

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

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  // eslint-disable-next-line consistent-return
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
}).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(
        response,
        401,
        "picture to large or extentions not jpg",
        null
      );
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingUpload;

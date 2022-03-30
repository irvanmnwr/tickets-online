const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "djoebcjsc",
  api_key: "426963234352173",
  api_secret: "ayIdYB7MUYy5wwQC8BipfDIiLfw",
});

module.exports = cloudinary;

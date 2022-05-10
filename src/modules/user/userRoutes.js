const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareUpload = require("../../middleware/uploadUser");
const middlewareAuth = require("../../middleware/auth");

Router.get("/:id", userController.getUserById);
Router.patch(
  "/update",
  middlewareAuth.authentication,
  userController.updateProfile
);
Router.patch(
  "/updatePassword",
  middlewareAuth.authentication,
  userController.updatePassword
);
Router.patch(
  "/updateimage",
  middlewareAuth.authentication,
  middlewareUpload,
  userController.updateImage
);

module.exports = Router;

const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareUpload = require("../../middleware/uploadUser");

Router.get("/", userController.getUserById);
Router.patch("/update", userController.updateProfile);
Router.patch("/updatePassword", userController.updatePassword);
Router.patch("/updateimage", middlewareUpload, userController.updateImage);

module.exports = Router;

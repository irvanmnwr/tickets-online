const express = require("express");

const Router = express.Router();

const userController = require("./userController");

Router.get("/", userController.getUserById);
Router.patch("/update", userController.updateProfile);
Router.patch("/updatePassword", userController.updatePassword);

module.exports = Router;

const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/login", authController.login);
Router.post("/register", authController.register);
Router.patch("/verification/:id", authController.verification);
Router.patch("/refresh", authController.refresh);
Router.post("/logout", authController.logout);

module.exports = Router;

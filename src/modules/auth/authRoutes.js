const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/login", authController.login);
Router.post("/register", authController.register);

module.exports = Router;

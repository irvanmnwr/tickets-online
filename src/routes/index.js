const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");
const authRoutes = require("../modules/auth/authRoutes");
const userRoutes = require("../modules/user/userRoutes");
const middlewareAuth = require("../middleware/auth");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", middlewareAuth.authentication, bookingRoutes);
Router.use("/auth", authRoutes);
Router.use("/user", middlewareAuth.authentication, userRoutes);

module.exports = Router;

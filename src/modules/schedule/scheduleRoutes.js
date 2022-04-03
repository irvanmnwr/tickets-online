const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
// create schedule
Router.post("/", middlewareAuth.isAdmin, scheduleController.createSchedule);
// update schedule
Router.patch(
  "/:id",
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  scheduleController.updateSchedule
);
// delete schedule
Router.delete(
  "/:id",
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;

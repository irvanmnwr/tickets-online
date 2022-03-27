const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.get("/seat", bookingController.getSeatBooking);
Router.get("/:id", bookingController.getBookingById);
Router.post("/", bookingController.createBooking);
// Router.patch("/:id", bookingController.updateSchedule);
// Router.delete("/:id", bookingController.deleteSchedule);

module.exports = Router;

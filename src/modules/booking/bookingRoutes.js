const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.get("/dashboard", bookingController.getDashboardBooking);
Router.get("/seat", bookingController.getSeatBooking);
Router.get("/:id", bookingController.getBookingById);
Router.post("/", bookingController.createBooking);
Router.patch("/:id", bookingController.updateStatusBooking);
// Router.post(
//   "/midtrans-notification",
//   bookingController.postMidtransNotification
// );

module.exports = Router;

const helperWrapper = require("../../helpers/wrapper");
// --
const bookingModel = require("./bookingModel");
// --
module.exports = {
  getBookingById: async (request, response) => {
    try {
      const { id } = request.params;
      const seat = await bookingModel.getBookingSeatById(id);
      const result = await bookingModel.getBookingById(id, seat);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getSeatBooking: async (request, response) => {
    try {
      let { scheduleId, dateBooking, timeBooking } = request.query;
      if (!scheduleId) {
        scheduleId = 1;
      }
      if (!dateBooking) {
        dateBooking = new Date(Date.now(`y-m-d`));
      }
      if (!timeBooking) {
        timeBooking = "HH:mm:ss";
      }
      const result = await bookingModel.getSeatBooking(
        scheduleId,
        dateBooking,
        timeBooking
      );
      const data = {
        scheduleId,
        dateBooking,
        timeBooking,
      };
      return helperWrapper.response(response, 200, "Success get data !", {
        ...data,
        result,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  createBooking: async (request, response) => {
    try {
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;
      const totalTicket = seat.length;
      const setData = {
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket,
        paymentMethod,
        totalPayment,
      };
      const result = await bookingModel.createBooking(setData);

      seat.map(async (val) => {
        const newData = {
          bookingId: result.insertId,
          seat: val,
        };
        await bookingModel.createSeat(newData);
      });

      return helperWrapper.response(response, 200, "Success get data !", {
        ...setData,
        seat,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      await bookingModel.updateStatusBooking(id);
      return helperWrapper.response(response, 200, "Success update data !", {
        id,
        statusUsed: "deactive",
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getDashboardBooking: async (request, response) => {
    try {
      let { scheduleId, premiere, location } = request.query;
      if (!scheduleId) {
        scheduleId = 1;
      }
      if (!premiere) {
        premiere = "";
      }
      if (!location) {
        location = "";
      }

      const data = {
        scheduleId,
        premiere,
        location,
      };

      premiere = `%${premiere}%`;
      location = `%${location}%`;

      const result = await bookingModel.getDashboardBooking(
        scheduleId,
        premiere,
        location
      );

      return helperWrapper.response(response, 200, `Success load data!`, {
        ...data,
        result,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};

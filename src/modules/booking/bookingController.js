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
        dateBooking = "yyyy-mm-dd";
      }
      if (!timeBooking) {
        timeBooking = "HH:mm:ss";
      }
      dateBooking = `%${dateBooking}%`;
      timeBooking = `%${timeBooking}%`;
      const result = await bookingModel.getSeatBooking(
        scheduleId,
        dateBooking,
        timeBooking
      );
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
      const setData = {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      };
      const result = await bookingModel.createBooking(setData);
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
  //   updateSchedule: async (request, response) => {
  //     try {
  //       const { id } = request.params;
  //       const { movieId, premiere, price, location, dateStart, dateEnd, time } =
  //         request.body;
  //       const setData = {
  //         movieId,
  //         premiere,
  //         price,
  //         location,
  //         dateStart,
  //         dateEnd,
  //         time,
  //         updateAt: new Date(Date.now()),
  //       };
  //       // eslint-disable-next-line no-restricted-syntax
  //       for (const data in setData) {
  //         // console.log(data); // property
  //         // console.log(setData[data]); // value
  //         if (!setData[data]) {
  //           delete setData[data];
  //         }
  //       }
  //       const result = await scheduleModel.updateSchedule(id, setData);
  //       return helperWrapper.response(
  //         response,
  //         200,
  //         "Success update data !",
  //         result
  //       );
  //     } catch (error) {
  //       return helperWrapper.response(response, 400, "Bad Request", null);
  //     }
  //   },
  //   deleteSchedule: async (request, response) => {
  //     try {
  //       const { id } = request.params;
  //       await scheduleModel.deleteSchedule(id);
  //       return helperWrapper.response(response, 200, `${id} has deleted !`, null);
  //     } catch (error) {
  //       return helperWrapper.response(response, 400, "Bad Request", null);
  //     }
  //   },
};

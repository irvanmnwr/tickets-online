const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const helperMidtrans = require("../../helpers/midtrans");
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
      const { id } = request.decodeToken;
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
        id: uuidv4(),
        userId: id,
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

      const setDataMidtrans = {
        id: uuidv4(),
        total: totalPayment,
      };

      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);
      return helperWrapper.response(response, 200, "Success post data !", {
        id: 1,
        ...setData,
        seat,
        redirectUrl: resultMidtrans.redirect_url,
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
        statusUsed: "notActive",
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
  bookingByUserId: async (request, response) => {
    try {
      const { id } = request.decodeToken;
      const result = await bookingModel.bookingByUserId(id);
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
  // postMidtransNotification: async (request, response) => {
  //   try {
  //     console.log(request.body);
  //     const result = await helperMidtrans.notif(request.body);
  //     const orderId = result.order_id;
  //     const transactionStatus = result.transaction_status;
  //     const fraudStatus = result.fraud_status;

  //     console.log(
  //       `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
  //     );

  //     // Sample transactionStatus handling logic

  //     if (transactionStatus === "capture") {
  //       // capture only applies to card transaction, which you need to check for the fraudStatus
  //       if (fraudStatus === "challenge") {
  //         // TODO set transaction status on your databaase to 'challenge'
  //         // UBAH STATUS PEMBAYARAN MENJADI PENDING
  //         // PROSES MEMANGGIL MODEL untuk mengubah data di dalam database
  //         // id = orderId;
  //         const setData = {
  //           paymentMethod: result.payment_type,
  //           statusPayment: "PENDING",
  //           // updatedAt: ...
  //         };
  //       } else if (fraudStatus === "accept") {
  //         // TODO set transaction status on your databaase to 'success'
  //         // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
  //         // id = orderId;
  //         const setData = {
  //           paymentMethod: result.payment_type,
  //           statusPayment: "SUCCESS",
  //           // updatedAt: ...
  //         };
  //       }
  //     } else if (transactionStatus === "settlement") {
  //       // TODO set transaction status on your databaase to 'success'
  //       // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
  //       // id = orderId;
  //       const setData = {
  //         paymentMethod: result.payment_type,
  //         statusPayment: "SUCCESS",
  //         // updatedAt: ...
  //       };
  //       console.log(
  //         `Sukses melakukan pembayaran dengan id ${orderId} dan data yang diubah ${JSON.stringify(
  //           setData
  //         )}`
  //       );
  //     } else if (transactionStatus === "deny") {
  //       // TODO you can ignore 'deny', because most of the time it allows payment retries
  //       // and later can become success
  //       // UBAH STATUS PEMBAYARAN MENJADI FAILED
  //     } else if (
  //       transactionStatus === "cancel" ||
  //       transactionStatus === "expire"
  //     ) {
  //       // TODO set transaction status on your databaase to 'failure'
  //       // UBAH STATUS PEMBAYARAN MENJADI FAILED
  //     } else if (transactionStatus === "pending") {
  //       // TODO set transaction status on your databaase to 'pending' / waiting payment
  //       // UBAH STATUS PEMBAYARAN MENJADI PENDING
  //     }
  //   } catch (error) {
  //     return helperWrapper.response(response, 400, "Bad Request", null);
  //   }
  // },
};

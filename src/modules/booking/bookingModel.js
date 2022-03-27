const connection = require("../../config/mysql");

module.exports = {
  getBookingSeatById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bs.seat FROM booking as b INNER join bookingseat as bs 
        where b.id = bs.bookingId and b.id = ?`,
        id,
        (error, result) => {
          if (!error) {
            const newResult = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const x of result) newResult.push(x.seat);
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingById: (id, x) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            const newResult = {
              ...result[0],
              seat: x,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bs.seat FROM booking as b INNER join bookingseat as bs 
        where b.id = bs.bookingId and b.scheduleId = ? 
        and time(b.timeBooking) = ? and date(b.dateBooking) = ?`,
        [scheduleId, timeBooking, dateBooking],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      const { seat } = data;
      // eslint-disable-next-line no-param-reassign
      delete data.seat;
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        if (!error) {
          const newData = { bookingId: result.insertId, seat };
          connection.query(
            "INSERT INTO bookingseat SET ?",
            newData,
            (newError, newResult) => {
              if (!newError) {
                resolve(newResult);
              }
            }
          );
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  // getCountSchedule: () =>
  //   new Promise((resolve, reject) => {
  //     connection.query(
  //       "SELECT COUNT(*) AS total FROM schedule ",
  //       (error, result) => {
  //         if (!error) {
  //           resolve(result[0].total);
  //         } else {
  //           reject(new Error(error.sqlMessage));
  //         }
  //       }
  //     );
  //   }),
  //   updateSchedule: (id, data) =>
  //     new Promise((resolve, reject) => {
  //       connection.query(
  //         "UPDATE schedule SET ? where id = ?",
  //         [data, id],
  //         (error) => {
  //           if (!error) {
  //             const newResult = {
  //               id,
  //               ...data,
  //             };
  //             resolve(newResult);
  //           } else {
  //             reject(new Error(error.sqlMessage));
  //           }
  //         }
  //       );
  //     }),
  //   deleteSchedule: (id) =>
  //     new Promise((resolve, reject) => {
  //       connection.query("DELETE FROM schedule WHERE id = ?", id, (error) => {
  //         if (!error) {
  //           resolve("");
  //         } else {
  //           reject(new Error(error.sqlMessage));
  //         }
  //       });
  //     }),
};

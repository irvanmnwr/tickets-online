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
        `SELECT b.*, m.name, m.category FROM booking as b 
        INNER JOIN schedule as s on s.id = b.scheduleId 
        INNER JOIN movie as m on m.id = s.movieId
        where b.id = ?;`,
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
  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT b.*, s.premiere, m.name from booking as b 
        inner join schedule as s on s.id = b.scheduleId  
        INNER JOIN movie as m on m.id = s.movieId 
        where b.userId = ? ORDER BY b.dateBooking`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
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
        on b.id = bs.bookingId where b.scheduleId = ? 
        and time(b.timeBooking) = ? and date(b.dateBooking) = ?`,
        [scheduleId, timeBooking, dateBooking],
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
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  createSeat: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO bookingseat SET ?",
        data,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateStatusBooking: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET statusUsed = '0' where id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getDashboardBooking: (scheduleId, premiere, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT month(b.createdAt) as month, sum(b.totalPayment) as price 
        FROM booking as b
        INNER JOIN schedule as s on s.id = b.scheduleId
        WHERE s.id = 2 and s.premiere LIKE "%%" and s.location LIKE "%%" 
        GROUP BY month(b.createdAt);`,
        [scheduleId, premiere, location],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  bookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking where userId = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};

const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule ",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (limit, offset, sort, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT s.id,s.location,s.premiere,s.price,s.time,m.name,m.category,m.synopsis 
        FROM schedule as s INNER JOIN movie as m
        WHERE s.movieId = m.id AND s.location LIKE ? ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [location, limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id = ?",
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
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? where id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM schedule WHERE id = ?", id, (error) => {
        if (!error) {
          resolve("");
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};

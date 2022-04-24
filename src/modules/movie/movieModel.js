const connection = require("../../config/mysql");

module.exports = {
  getCountMovie: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM movie",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllMovie: (limit, offset, sort, name, releaseDate) =>
    new Promise((resolve, reject) => {
      if (!releaseDate) {
        connection.query(
          `SELECT * FROM movie WHERE name LIKE ? ORDER BY ${sort} LIMIT ? OFFSET ?`,
          [name, limit, offset],
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(new Error(error.sqlMessage));
            }
          }
        );
      }
      connection.query(
        `SELECT * FROM movie WHERE name LIKE ? AND MONTH(releaseDate) = ? ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [name, releaseDate, limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getMovieById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie WHERE id = ?",
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
  createMovie: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO movie SET ?", data, (error, result) => {
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
  updateMovie: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE movie SET ? where id = ?",
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
  deleteMovie: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM movie WHERE id = ?", id, (error) => {
        if (!error) {
          resolve("");
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};

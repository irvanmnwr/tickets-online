// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config();
const mysql = require("mysql2");

console.log(process.env.HOST);
const connection = mysql.createConnection({
  // host: process.env.HOST,
  // user: process.env.USER,
  // password: process.env.PASSWORD,
  // database: process.env.DATABASE,
  host: "localhost",
  user: "root",
  password: "",
  database: "db_tickets",
  port: 3306,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log("You're now connected db mysql ...");
});

module.exports = connection;

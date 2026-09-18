const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "iot_dashboard",
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal terhubung");
    console.log(err);
    return;
  }

  console.log("MySQL Connected");
});

module.exports = db;
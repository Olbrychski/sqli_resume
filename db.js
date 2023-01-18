const mysql = require("mysql2");

let connection = mysql.createConnection({
    host: 'localhost',
    database: "resume",
    user: 'root',
    password: 'password'
})

module.exports = connection;

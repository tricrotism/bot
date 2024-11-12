var mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    port: 3306,
    debug: false
});

module.exports = connection;
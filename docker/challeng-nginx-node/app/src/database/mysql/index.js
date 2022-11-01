const mysql = require('mysql');
const config = require('./config');

const connect = () => mysql.createConnection(config);

module.exports = {
  connect
}
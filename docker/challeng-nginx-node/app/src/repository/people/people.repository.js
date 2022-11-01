const { connect } = require("../../database/mysql");

const findName = async () => {
  return new Promise((resolve) => {
    const connection = connect();
    const sql = `SELECT name FROM people LIMIT 1`;
    
    let name;
    connection.query(sql, (error, results, fields) => {
      if (error) {
        throw error;
      }
  
      resolve({
        name: results[0].name
      });
    })

    connection.end();
  })
}

module.exports = {
  findName
}
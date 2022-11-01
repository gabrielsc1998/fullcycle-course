const express = require('express');

const start = (port = 3000) => {
  const app = express();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
  return app;
}

module.exports = {
  start
}
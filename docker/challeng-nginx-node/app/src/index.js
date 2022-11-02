const server = require('./server')
const database = require('./database/mysql');

const { findName } = require('./repository/people/people.repository');

const bootstrap = () => {
  const app = server.start(3000);

  app.get('/', async (req, res) => {
    const { name } = await findName();

    const resp = `
      <h1>Full Cycle Rocks!</h1>
      <hr />
      <p>${name}<p/>
    `
    res.send(resp);
  })
}

bootstrap();
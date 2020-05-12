const initOptions = {};
const pgp = require('pg-promise')(initOptions);

const username = 'postgres';
const password = 'postgres';
const database = 'test_db';
const host = 'dev-database';
const port = 5432

const dbConnection = pgp({
  host,
  port,
  database,
  user: username, 
  password,
});

dbConnection.connect().then((obj) => {
  obj.done();
}).catch((error) => {
  console.log('ERROR ON POSTGRESQL CONNECTION', error);
});

exports.dbConnection = dbConnection;

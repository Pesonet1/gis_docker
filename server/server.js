const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes');

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

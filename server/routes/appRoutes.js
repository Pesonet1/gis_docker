const express = require('express');
const router = express.Router();

const SequelizeModels = require('../models').sequelize.models;

router.get('/', (req, res) => {
  res.send('api root');
});

router.get('/users', (req, res) => {
  SequelizeModels.Users.findAll().then((data) => {
    return res.json(data);
  }).catch((error) => {
    return res.sendStatus(404);
  });
});

module.exports = router;

const express = require('express');
const { isUserSessionActive } = require('../utils/session');
const router = express.Router();

const SequelizeModels = require('../models').sequelize.models;

module.exports = (apiPath, app, provider) => {
  router.get('/users', async (req, res, next) => {
    const sessionActive = await isUserSessionActive(provider, req, res);
    if (!sessionActive) res.sendStatus(403);

    SequelizeModels.Users.findAll().then((data) => {
      return res.json(data);
    }).catch((error) => {
      return res.sendStatus(404);
    });
  });

  app.use(apiPath, router);
}

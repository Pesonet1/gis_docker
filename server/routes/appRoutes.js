const express = require('express');
const router = express.Router();

// const Account = require('../oidc/account');

const SequelizeModels = require('../models').sequelize.models;

module.exports = (apiPrefix, app, provider) => {
  async function isUserSessionActive(provider, req, res) {
    const ctx = provider.app.createContext(req, res);
    const session = await provider.Session.get(ctx);
    const signedIn = !!session.account;

    // if (signedIn) {
    //   const account = await Account.findAccount(null, session.account)
    //   console.log('User account', account, account.claims())
    // }
  
    return signedIn;
  };

  router.get('/users', async (req, res, next) => {
    const sessionActive = await isUserSessionActive(provider, req, res);
    if (!sessionActive) res.sendStatus(403);

    SequelizeModels.Users.findAll().then((data) => {
      return res.json(data);
    }).catch((error) => {
      return res.sendStatus(404);
    });
  });

  app.use(apiPrefix, router);
}

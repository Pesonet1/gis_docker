// const Account = require('../oidc/account');

const isUserSessionActive = async (provider, req, res) => {
  const ctx = provider.app.createContext(req, res);
  const session = await provider.Session.get(ctx);
  const signedIn = !!session.account;

  // if (signedIn) {
  //   const account = await Account.findAccount(null, session.account)
  //   console.log('User account', account, account.claims())
  // }

  return signedIn;
};

module.exports = { isUserSessionActive };
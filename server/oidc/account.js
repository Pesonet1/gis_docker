const SequelizeModels = require('../models').sequelize.models;

class Account {
  static async findAccount(ctx, id) {
    return SequelizeModels.Users.findOne({
      where: { id: id }
    }).then((account) => {
      if (!account) return undefined;

      return {
        accountId: id,
        claims() {
          return {
            sub: id,
            email: account.email,
            email_verified: account.email_verified,
          };
        },
      };
    });
  }
}

module.exports = Account;

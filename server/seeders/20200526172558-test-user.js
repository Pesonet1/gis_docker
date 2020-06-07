const { v4: uuidv4 } = require('uuid');

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      password: 'testi',
      email: 'testi@testi.com',
      email_verified: true,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

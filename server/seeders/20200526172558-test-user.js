const { v4: uuidv4 } = require('uuid');

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      password: '$2a$10$.Rk.gkjvpmf1zHxCypgfp.HC1qDcJYsec2RjD55Ij/KX3WE7qMQ0i',
      email: 'testi@testi.com',
      email_verified: true,
      createdAt: new Date,
      updatedAt: new Date,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

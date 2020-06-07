'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    password: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    email_verified: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
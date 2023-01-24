// ==============generate=============
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    //* Helper method for defining associations.
    //* This method is not a part of Sequelize lifecycle.
    //* The `models/index` file will call this method automatically.

    static associate(models) {
      // define association here
      models.User.hasMany(models.Blog, {
        as: 'blogs',
        foreignKey: 'user_id', //fk's blogs table
        sourceKey: 'id' //pl's users table
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING(100),
      email: {
        type: DataTypes.STRING(200),
        unique: true,
        allowNull: false,
      },
      password: DataTypes.STRING(100),
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: 'users',
      timestamps: false
    }
  );
  return User;
};

/* =====Generate from sequelize version 5
'use strict';

const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING(100),
    email: {
      type: DataTypes.STRING(200),
      unique: true,
      allowNull: false
    },
    password: DataTypes.STRING(100),
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  
  }, {
      tableName: 'users',
      timestamps: false
  });
User.associate = function(models) {

};

return User;
};
*/

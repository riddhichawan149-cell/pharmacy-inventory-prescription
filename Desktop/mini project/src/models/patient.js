const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Patient', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING(80), allowNull: false, validate: { notEmpty: true } },
    lastName: { type: DataTypes.STRING(80), allowNull: false, validate: { notEmpty: true } },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true }
    },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true }
  }, {
    tableName: 'patients'
  });

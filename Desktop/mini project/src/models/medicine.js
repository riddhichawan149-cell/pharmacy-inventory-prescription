const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Medicine', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    sku: { type: DataTypes.STRING(60), allowNull: false, unique: true, validate: { notEmpty: true } },
    category: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01, isDecimal: true }
    },
    stockQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, isInt: true }
    },
    reorderLevel: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 10,
      validate: { min: 0, isInt: true }
    },
    expiryDate: { type: DataTypes.DATEONLY, allowNull: true }
  }, {
    tableName: 'medicines'
  });

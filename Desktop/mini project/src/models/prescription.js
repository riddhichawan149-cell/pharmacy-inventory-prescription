const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Prescription', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    patientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    prescribedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.ENUM('billed', 'cancelled'),
      allowNull: false,
      defaultValue: 'billed'
    },
    totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 }
  }, {
    tableName: 'prescriptions'
  });

const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('PrescriptionItem', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    prescriptionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    medicineId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 1, isInt: true } },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0.01 } },
    lineTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0.01 } }
  }, {
    tableName: 'prescription_items',
    indexes: [{ unique: true, fields: ['prescription_id', 'medicine_id'] }]
  });

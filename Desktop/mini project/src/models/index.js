const sequelize = require('../config/database');

const Patient = require('./patient')(sequelize);
const Medicine = require('./medicine')(sequelize);
const Prescription = require('./prescription')(sequelize);
const PrescriptionItem = require('./prescriptionItem')(sequelize);

Patient.hasMany(Prescription, { foreignKey: 'patientId', as: 'prescriptions' });
Prescription.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Prescription.hasMany(PrescriptionItem, { foreignKey: 'prescriptionId', as: 'items' });
PrescriptionItem.belongsTo(Prescription, { foreignKey: 'prescriptionId', as: 'prescription' });
Medicine.hasMany(PrescriptionItem, { foreignKey: 'medicineId', as: 'prescriptionItems' });
PrescriptionItem.belongsTo(Medicine, { foreignKey: 'medicineId', as: 'medicine' });

module.exports = { sequelize, Patient, Medicine, Prescription, PrescriptionItem };

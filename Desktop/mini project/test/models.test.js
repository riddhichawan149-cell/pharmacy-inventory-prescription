const test = require('node:test');
const assert = require('node:assert/strict');
const { Patient, Medicine, Prescription, PrescriptionItem } = require('../src/models');
const { ValidationError } = require('sequelize');

test('models enforce email, price, and inventory validations without database access', async () => {
  const invalidPatient = Patient.build({
    firstName: 'Test',
    lastName: 'Patient',
    email: 'not-an-email'
  });
  const invalidMedicine = Medicine.build({
    name: 'Invalid stock',
    sku: 'INVALID-1',
    category: 'Test',
    unitPrice: '0.00',
    stockQuantity: -1,
    reorderLevel: 5
  });

  await assert.rejects(invalidPatient.validate(), ValidationError);
  await assert.rejects(invalidMedicine.validate(), ValidationError);
});

test('prescriptions retain patient and medicine relationships through line items', () => {
  assert.ok(Patient.associations.prescriptions);
  assert.ok(Prescription.associations.patient);
  assert.ok(Prescription.associations.items);
  assert.ok(PrescriptionItem.associations.medicine);
});

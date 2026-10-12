const { Transaction } = require('sequelize');
const { sequelize, Patient, Medicine, Prescription, PrescriptionItem } = require('../models');
const { getPagination } = require('../utils/pagination');
const { toCents, fromCents } = require('../utils/money');
const HttpError = require('../utils/httpError');

const prescriptionIncludes = [
  { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'email'] },
  {
    model: PrescriptionItem,
    as: 'items',
    include: [{ model: Medicine, as: 'medicine', attributes: ['id', 'name', 'sku'] }]
  }
];

async function list(req, res) {
  const { limit, offset, page } = getPagination(req.query);
  const where = {};
  if (req.query.patientId) where.patientId = req.query.patientId;
  if (req.query.status) where.status = req.query.status;

  const result = await Prescription.findAndCountAll({
    where,
    include: prescriptionIncludes,
    distinct: true,
    limit,
    offset,
    order: [['prescribedAt', 'DESC']]
  });
  res.json({ data: result.rows, pagination: { page, limit, total: result.count } });
}

async function get(req, res) {
  const prescription = await Prescription.findByPk(req.params.id, { include: prescriptionIncludes });
  if (!prescription) throw new HttpError(404, 'Prescription not found.');
  res.json({ data: prescription });
}

async function create(req, res) {
  const { patientId, items } = req.body;
  if (!Number.isInteger(Number(patientId)) || Number(patientId) < 1) {
    throw new HttpError(400, 'patientId must be a positive integer.');
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
    throw new HttpError(400, 'items must be a non-empty array of at most 100 medicines.');
  }

  const seen = new Set();
  for (const item of items) {
    if (item === null || typeof item !== 'object' || Array.isArray(item)
      || !Number.isInteger(Number(item.medicineId)) || Number(item.medicineId) < 1
      || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new HttpError(400, 'Each item requires a positive integer medicineId and quantity.');
    }
    if (seen.has(Number(item.medicineId))) {
      throw new HttpError(400, 'A medicine may only appear once in a prescription.');
    }
    seen.add(Number(item.medicineId));
  }

  const result = await sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    async (transaction) => {
      const patient = await Patient.findByPk(patientId, { transaction });
      if (!patient) throw new HttpError(404, 'Patient not found.');

      const requestedIds = [...seen].sort((a, b) => a - b);
      const medicines = await Medicine.findAll({
        where: { id: requestedIds },
        order: [['id', 'ASC']],
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (medicines.length !== requestedIds.length) {
        throw new HttpError(404, 'One or more medicines were not found.');
      }

      const medicineById = new Map(medicines.map((medicine) => [medicine.id, medicine]));
      let totalCents = 0;
      const lineItems = items.map((item) => {
        const medicine = medicineById.get(Number(item.medicineId));
        if (medicine.stockQuantity < item.quantity) {
          throw new HttpError(409, `Insufficient stock for medicine "${medicine.name}".`);
        }
        const unitPriceCents = toCents(medicine.unitPrice);
        const lineTotalCents = unitPriceCents * item.quantity;
        totalCents += lineTotalCents;
        return {
          medicine,
          quantity: item.quantity,
          unitPrice: fromCents(unitPriceCents),
          lineTotal: fromCents(lineTotalCents)
        };
      });

      const prescription = await Prescription.create({
        patientId: patient.id,
        totalAmount: fromCents(totalCents),
        status: 'billed'
      }, { transaction });

      await PrescriptionItem.bulkCreate(lineItems.map((item) => ({
        prescriptionId: prescription.id,
        medicineId: item.medicine.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      })), { transaction });

      for (const item of lineItems) {
        await item.medicine.decrement('stockQuantity', {
          by: item.quantity,
          transaction
        });
      }

      return Prescription.findByPk(prescription.id, {
        include: prescriptionIncludes,
        transaction
      });
    }
  );

  res.status(201).json({ data: result });
}

module.exports = { list, get, create };

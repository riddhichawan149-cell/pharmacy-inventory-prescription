const { Op } = require('sequelize');
const { sequelize, Medicine } = require('../models');
const { getPagination } = require('../utils/pagination');
const HttpError = require('../utils/httpError');

async function list(req, res) {
  const { limit, offset, page } = getPagination(req.query);
  const where = {};
  if (req.query.category) where.category = req.query.category;
  if (req.query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${req.query.search}%` } },
      { sku: { [Op.like]: `%${req.query.search}%` } }
    ];
  }
  if (req.query.lowStock === 'true') {
    where.stockQuantity = { [Op.lte]: Medicine.sequelize.col('reorder_level') };
  }

  const result = await Medicine.findAndCountAll({
    where,
    limit,
    offset,
    order: [['name', 'ASC']]
  });
  res.json({ data: result.rows, pagination: { page, limit, total: result.count } });
}

async function get(req, res) {
  const medicine = await Medicine.findByPk(req.params.id);
  if (!medicine) throw new HttpError(404, 'Medicine not found.');
  res.json({ data: medicine });
}

async function create(req, res) {
  const medicine = await Medicine.create(req.body);
  res.status(201).json({ data: medicine });
}

async function update(req, res) {
  const medicine = await sequelize.transaction(async (transaction) => {
    const record = await Medicine.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!record) throw new HttpError(404, 'Medicine not found.');
    await record.update(req.body, { transaction });
    return record;
  });
  res.json({ data: medicine });
}

async function remove(req, res) {
  const medicine = await Medicine.findByPk(req.params.id);
  if (!medicine) throw new HttpError(404, 'Medicine not found.');
  await medicine.destroy();
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };

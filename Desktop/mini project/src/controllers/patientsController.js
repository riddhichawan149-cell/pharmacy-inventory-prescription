const { Patient } = require('../models');
const { getPagination } = require('../utils/pagination');
const HttpError = require('../utils/httpError');

async function list(req, res) {
  const { limit, offset, page } = getPagination(req.query);
  const result = await Patient.findAndCountAll({
    limit,
    offset,
    order: [['lastName', 'ASC'], ['firstName', 'ASC']]
  });
  res.json({ data: result.rows, pagination: { page, limit, total: result.count } });
}

async function get(req, res) {
  const patient = await Patient.findByPk(req.params.id);
  if (!patient) throw new HttpError(404, 'Patient not found.');
  res.json({ data: patient });
}

async function create(req, res) {
  const patient = await Patient.create(req.body);
  res.status(201).json({ data: patient });
}

async function update(req, res) {
  const patient = await Patient.findByPk(req.params.id);
  if (!patient) throw new HttpError(404, 'Patient not found.');
  await patient.update(req.body);
  res.json({ data: patient });
}

async function remove(req, res) {
  const patient = await Patient.findByPk(req.params.id);
  if (!patient) throw new HttpError(404, 'Patient not found.');
  await patient.destroy();
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };

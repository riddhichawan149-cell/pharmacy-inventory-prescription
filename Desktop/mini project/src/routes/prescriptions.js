const express = require('express');
const controller = require('../controllers/prescriptionsController');
const asyncHandler = require('../utils/asyncHandler');
const validateBody = require('../middleware/validateBody');

const router = express.Router();
router.route('/')
  .get(asyncHandler(controller.list))
  .post(validateBody(['patientId', 'items']), asyncHandler(controller.create));
router.get('/:id', asyncHandler(controller.get));

module.exports = router;

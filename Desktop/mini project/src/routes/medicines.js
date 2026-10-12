const express = require('express');
const controller = require('../controllers/medicinesController');
const asyncHandler = require('../utils/asyncHandler');
const validateBody = require('../middleware/validateBody');

const router = express.Router();
router.route('/')
  .get(asyncHandler(controller.list))
  .post(validateBody(['name', 'sku', 'category', 'unitPrice', 'stockQuantity', 'reorderLevel', 'expiryDate']), asyncHandler(controller.create));
router.route('/:id')
  .get(asyncHandler(controller.get))
  .patch(validateBody(['name', 'sku', 'category', 'unitPrice', 'stockQuantity', 'reorderLevel', 'expiryDate']), asyncHandler(controller.update))
  .delete(asyncHandler(controller.remove));

module.exports = router;

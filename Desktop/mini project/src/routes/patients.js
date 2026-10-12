const express = require('express');
const controller = require('../controllers/patientsController');
const asyncHandler = require('../utils/asyncHandler');
const validateBody = require('../middleware/validateBody');

const router = express.Router();
router.route('/')
  .get(asyncHandler(controller.list))
  .post(validateBody(['firstName', 'lastName', 'email', 'phone', 'dateOfBirth']), asyncHandler(controller.create));
router.route('/:id')
  .get(asyncHandler(controller.get))
  .patch(validateBody(['firstName', 'lastName', 'email', 'phone', 'dateOfBirth']), asyncHandler(controller.update))
  .delete(asyncHandler(controller.remove));

module.exports = router;

const express = require('express');
const controller = require('../controllers/reportsController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.get('/inventory', asyncHandler(controller.inventory));

module.exports = router;

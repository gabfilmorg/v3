const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/auth');

// Rotas básicas
router.post('/generate', protect, authorize('admin', 'manager'), reportController.generateReport);
router.get('/', protect, reportController.getReports);
router.get('/:id', protect, reportController.getReport);
router.get('/:id/export', protect, reportController.exportReport);

module.exports = router; 
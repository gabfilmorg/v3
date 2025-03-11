const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { protect, authorize } = require('../middlewares/auth');

// Rotas básicas de CRUD
router.post('/', protect, authorize('admin', 'manager'), equipmentController.createEquipment);
router.get('/', protect, equipmentController.getAllEquipments);
router.get('/available', protect, equipmentController.findAvailableEquipments);
router.get('/:id', protect, equipmentController.getEquipment);
router.put('/:id', protect, authorize('admin', 'manager'), equipmentController.updateEquipment);
router.delete('/:id', protect, authorize('admin'), equipmentController.deleteEquipment);

// Rotas de gestão
router.post('/:id/assign', protect, authorize('admin', 'manager'), equipmentController.assignEquipment);
router.post('/:id/maintenance', protect, authorize('admin', 'manager'), equipmentController.logMaintenance);

module.exports = router; 
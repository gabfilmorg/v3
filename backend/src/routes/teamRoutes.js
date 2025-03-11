const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protect, authorize } = require('../middlewares/auth');

// Rotas básicas de CRUD
router.post('/', protect, authorize('admin', 'manager'), teamController.createTeamMember);
router.get('/', protect, teamController.getAllTeamMembers);
router.get('/available', protect, teamController.findAvailableMembers);
router.get('/:id', protect, teamController.getTeamMember);
router.put('/:id', protect, authorize('admin', 'manager'), teamController.updateTeamMember);
router.delete('/:id', protect, authorize('admin'), teamController.deleteTeamMember);

// Rotas de gestão de disponibilidade
router.post('/:id/unavailable', protect, teamController.addUnavailablePeriod);

// Rotas de portfólio e certificações
router.post('/:id/portfolio', protect, teamController.addPortfolioItem);
router.post('/:id/certifications', protect, teamController.addCertification);

// Rotas de registro de trabalho
router.post('/:id/work-hours', protect, teamController.logWorkHours);
router.post('/:id/evaluate', protect, authorize('admin', 'manager'), teamController.evaluatePerformance);

module.exports = router; 
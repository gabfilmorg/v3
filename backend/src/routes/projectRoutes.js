const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');

// Rotas básicas de CRUD
router.post('/', protect, projectController.createProject);
router.get('/', protect, projectController.getAllProjects);
router.get('/:id', protect, projectController.getProject);
router.put('/:id', protect, projectController.updateProject);
router.delete('/:id', protect, authorize('admin'), projectController.deleteProject);

// Rotas de equipe
router.post('/:id/team', protect, projectController.addTeamMember);
router.delete('/:id/team/:memberId', protect, projectController.removeTeamMember);

// Rotas de tarefas
router.post('/:id/tasks', protect, projectController.addTask);
router.put('/:id/tasks/:taskId', protect, projectController.updateTaskStatus);

// Rotas de marcos
router.post('/:id/milestones', protect, projectController.addMilestone);
router.put('/:id/milestones/:milestoneId', protect, projectController.updateMilestone);

module.exports = router; 
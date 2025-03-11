const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationTemplateController = require('../controllers/notificationTemplateController');

// Rotas protegidas por autenticação
router.use(auth);

// Listar templates
router.get('/', notificationTemplateController.listarTemplates);

// Criar template
router.post('/', notificationTemplateController.criarTemplate);

// Obter template específico
router.get('/:id', notificationTemplateController.getTemplate);

// Atualizar template
router.put('/:id', notificationTemplateController.atualizarTemplate);

// Desativar template
router.delete('/:id', notificationTemplateController.desativarTemplate);

// Criar notificação a partir de template
router.post('/:id/notificar', notificationTemplateController.criarNotificacaoDeTemplate);

// Pré-visualizar template
router.post('/:id/preview', notificationTemplateController.preVisualizarTemplate);

module.exports = router; 
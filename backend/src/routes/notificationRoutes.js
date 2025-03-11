const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/auth');

// Rotas básicas
router.get('/', protect, notificationController.getNotificacoes);
router.get('/nao-lidas', protect, notificationController.getNotificacoesNaoLidas);
router.post('/', protect, authorize('admin', 'manager'), notificationController.criarNotificacao);
router.put('/:id/lida', protect, notificationController.marcarComoLida);
router.put('/marcar-todas-lidas', protect, notificationController.marcarTodasComoLidas);
router.delete('/:id', protect, notificationController.excluirNotificacao);

module.exports = router; 
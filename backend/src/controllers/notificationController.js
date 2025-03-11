const Notification = require('../models/Notification');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// Buscar notificações do usuário
exports.getNotificacoes = async (req, res) => {
    try {
        const notificacoes = await Notification.find({
            'destinatarios.usuario': req.user._id,
            status: { $ne: 'expirada' }
        })
        .populate('referencias.equipamento')
        .populate('referencias.projeto')
        .populate('referencias.teamMember')
        .sort('-createdAt');

        res.json(notificacoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Marcar notificação como lida
exports.marcarComoLida = async (req, res) => {
    try {
        const notificacao = await Notification.findById(req.params.id);
        
        if (!notificacao) {
            return res.status(404).json({ error: 'Notificação não encontrada' });
        }

        await notificacao.marcarComoLida(req.user._id);
        res.json(notificacao);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Criar nova notificação
exports.criarNotificacao = async (req, res) => {
    try {
        const {
            tipo,
            titulo,
            mensagem,
            prioridade,
            destinatarios,
            referencias,
            dataAgendada,
            dataExpiracao,
            acoes
        } = req.body;

        const notificacao = new Notification({
            tipo,
            titulo,
            mensagem,
            prioridade,
            destinatarios: destinatarios.map(d => ({ usuario: d })),
            referencias,
            dataAgendada,
            dataExpiracao,
            acoes
        });

        await notificacao.save();
        res.status(201).json(notificacao);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Verificar notificações de manutenção
exports.verificarManutencoesVencidas = async () => {
    try {
        const equipamentos = await Equipment.find({
            'maintenanceHistory.nextMaintenanceDate': { $lte: new Date() }
        });

        for (const equipamento of equipamentos) {
            const ultimaManutencao = equipamento.maintenanceHistory[
                equipamento.maintenanceHistory.length - 1
            ];

            await Notification.criarNotificacaoManutencao(
                equipamento,
                ultimaManutencao.nextMaintenanceDate,
                'vencida'
            );
        }
    } catch (error) {
        console.error('Erro ao verificar manutenções:', error);
    }
};

// Verificar seguros próximos do vencimento
exports.verificarSegurosVencimento = async () => {
    try {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + 30); // Próximos 30 dias

        const equipamentos = await Equipment.find({
            'insurance.expiryDate': {
                $gte: new Date(),
                $lte: dataLimite
            }
        });

        for (const equipamento of equipamentos) {
            await Notification.criarNotificacaoSeguro(
                equipamento,
                equipamento.insurance.expiryDate
            );
        }
    } catch (error) {
        console.error('Erro ao verificar seguros:', error);
    }
};

// Buscar notificações não lidas
exports.getNotificacoesNaoLidas = async (req, res) => {
    try {
        const notificacoes = await Notification.find({
            'destinatarios': {
                $elemMatch: {
                    usuario: req.user._id,
                    lida: false
                }
            },
            status: { $ne: 'expirada' }
        })
        .populate('referencias.equipamento')
        .populate('referencias.projeto')
        .populate('referencias.teamMember')
        .sort('-createdAt');

        res.json(notificacoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Marcar todas as notificações como lidas
exports.marcarTodasComoLidas = async (req, res) => {
    try {
        const notificacoes = await Notification.find({
            'destinatarios.usuario': req.user._id,
            'destinatarios.lida': false
        });

        for (const notificacao of notificacoes) {
            await notificacao.marcarComoLida(req.user._id);
        }

        res.json({ message: 'Todas as notificações foram marcadas como lidas' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Excluir notificação
exports.excluirNotificacao = async (req, res) => {
    try {
        const notificacao = await Notification.findById(req.params.id);
        
        if (!notificacao) {
            return res.status(404).json({ error: 'Notificação não encontrada' });
        }

        // Remover apenas para o usuário atual
        notificacao.destinatarios = notificacao.destinatarios.filter(
            d => d.usuario.toString() !== req.user._id.toString()
        );

        if (notificacao.destinatarios.length === 0) {
            await notificacao.remove();
        } else {
            await notificacao.save();
        }

        res.json({ message: 'Notificação removida com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
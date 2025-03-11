const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: [
            'manutencao_programada',
            'manutencao_vencida',
            'seguro_vencimento',
            'equipamento_retorno',
            'projeto_inicio',
            'projeto_fim',
            'equipe_disponibilidade',
            'reserva_confirmada',
            'reserva_cancelada',
            'alerta_conflito'
        ],
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    mensagem: {
        type: String,
        required: true
    },
    prioridade: {
        type: String,
        enum: ['baixa', 'media', 'alta', 'urgente'],
        default: 'media'
    },
    destinatarios: [{
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        lida: {
            type: Boolean,
            default: false
        },
        dataLeitura: Date
    }],
    referencias: {
        equipamento: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment'
        },
        projeto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        teamMember: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TeamMember'
        }
    },
    dataAgendada: Date,
    dataExpiracao: Date,
    acoes: [{
        tipo: String,
        url: String,
        texto: String
    }],
    status: {
        type: String,
        enum: ['pendente', 'enviada', 'lida', 'expirada', 'resolvida'],
        default: 'pendente'
    },
    metadados: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Método para marcar notificação como lida
notificationSchema.methods.marcarComoLida = async function(userId) {
    const destinatario = this.destinatarios.find(d => 
        d.usuario.toString() === userId.toString()
    );
    
    if (destinatario && !destinatario.lida) {
        destinatario.lida = true;
        destinatario.dataLeitura = new Date();
        await this.save();
    }
};

// Método para verificar se notificação expirou
notificationSchema.methods.verificarExpiracao = function() {
    if (this.dataExpiracao && new Date() > this.dataExpiracao) {
        this.status = 'expirada';
        return true;
    }
    return false;
};

// Método para adicionar ação
notificationSchema.methods.adicionarAcao = function(tipo, url, texto) {
    this.acoes.push({ tipo, url, texto });
};

// Método estático para criar notificação de manutenção
notificationSchema.statics.criarNotificacaoManutencao = async function(equipamento, dataManutencao, tipo = 'programada') {
    const titulo = tipo === 'programada' ? 
        'Manutenção Programada' : 
        'Manutenção Vencida';
    
    const mensagem = tipo === 'programada' ?
        `Manutenção programada para ${equipamento.name} em ${dataManutencao.toLocaleDateString()}` :
        `A manutenção do equipamento ${equipamento.name} está vencida desde ${dataManutencao.toLocaleDateString()}`;
    
    return await this.create({
        tipo: tipo === 'programada' ? 'manutencao_programada' : 'manutencao_vencida',
        titulo,
        mensagem,
        prioridade: tipo === 'programada' ? 'media' : 'alta',
        referencias: { equipamento: equipamento._id },
        dataAgendada: dataManutencao,
        status: 'pendente'
    });
};

// Método estático para criar notificação de vencimento de seguro
notificationSchema.statics.criarNotificacaoSeguro = async function(equipamento, dataVencimento) {
    const diasRestantes = Math.ceil((dataVencimento - new Date()) / (1000 * 60 * 60 * 24));
    
    return await this.create({
        tipo: 'seguro_vencimento',
        titulo: 'Vencimento de Seguro Próximo',
        mensagem: `O seguro do equipamento ${equipamento.name} vencerá em ${diasRestantes} dias`,
        prioridade: diasRestantes <= 7 ? 'alta' : 'media',
        referencias: { equipamento: equipamento._id },
        dataAgendada: dataVencimento,
        status: 'pendente'
    });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 
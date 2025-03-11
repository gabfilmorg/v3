const mongoose = require('mongoose');

const notificationTemplateSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    descricao: String,
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
    tituloTemplate: {
        type: String,
        required: true
    },
    mensagemTemplate: {
        type: String,
        required: true
    },
    prioridade: {
        type: String,
        enum: ['baixa', 'media', 'alta', 'urgente'],
        default: 'media'
    },
    acoesTemplate: [{
        tipo: String,
        urlTemplate: String,
        textoTemplate: String
    }],
    variaveis: [{
        nome: String,
        descricao: String,
        obrigatorio: {
            type: Boolean,
            default: true
        }
    }],
    categoria: {
        type: String,
        enum: ['equipamento', 'projeto', 'equipe', 'sistema'],
        required: true
    },
    ativo: {
        type: Boolean,
        default: true
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Método para processar template
notificationTemplateSchema.methods.processarTemplate = function(variaveis) {
    let titulo = this.tituloTemplate;
    let mensagem = this.mensagemTemplate;
    
    // Substituir variáveis no título e mensagem
    Object.entries(variaveis).forEach(([chave, valor]) => {
        const regex = new RegExp(`{{${chave}}}`, 'g');
        titulo = titulo.replace(regex, valor);
        mensagem = mensagem.replace(regex, valor);
    });
    
    // Processar ações
    const acoes = this.acoesTemplate.map(acao => ({
        tipo: acao.tipo,
        url: this.processarVariaveisString(acao.urlTemplate, variaveis),
        texto: this.processarVariaveisString(acao.textoTemplate, variaveis)
    }));
    
    return {
        tipo: this.tipo,
        titulo,
        mensagem,
        prioridade: this.prioridade,
        acoes
    };
};

// Método auxiliar para processar strings com variáveis
notificationTemplateSchema.methods.processarVariaveisString = function(template, variaveis) {
    let resultado = template;
    Object.entries(variaveis).forEach(([chave, valor]) => {
        const regex = new RegExp(`{{${chave}}}`, 'g');
        resultado = resultado.replace(regex, valor);
    });
    return resultado;
};

// Método para validar variáveis
notificationTemplateSchema.methods.validarVariaveis = function(variaveis) {
    const variaveisObrigatorias = this.variaveis
        .filter(v => v.obrigatorio)
        .map(v => v.nome);
    
    const variaveisRecebidas = Object.keys(variaveis);
    
    const faltando = variaveisObrigatorias.filter(v => !variaveisRecebidas.includes(v));
    
    if (faltando.length > 0) {
        throw new Error(`Variáveis obrigatórias faltando: ${faltando.join(', ')}`);
    }
    
    return true;
};

const NotificationTemplate = mongoose.model('NotificationTemplate', notificationTemplateSchema);

module.exports = NotificationTemplate; 
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['utilizacao', 'manutencao', 'financeiro', 'depreciacao'],
        required: true
    },
    periodoInicio: {
        type: Date,
        required: true
    },
    periodoFim: {
        type: Date,
        required: true
    },
    equipamentos: [{
        equipamento: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment'
        },
        metricas: {
            diasUtilizados: Number,
            horasUtilizadas: Number,
            custosManutencao: Number,
            valorDepreciado: Number,
            receitaGerada: Number,
            projetosUtilizados: [{
                projeto: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Project'
                },
                horasUtilizadas: Number,
                valorCobrado: Number
            }],
            manutencoes: [{
                data: Date,
                tipo: String,
                custo: Number,
                descricao: String
            }]
        }
    }],
    totalizadores: {
        custoTotalManutencao: Number,
        receitaTotal: Number,
        horasTotaisUso: Number,
        depreciacaoTotal: Number,
        taxaOcupacao: Number
    },
    filtros: {
        tipos: [String],
        status: [String],
        projetos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }]
    },
    formato: {
        type: String,
        enum: ['detalhado', 'resumido', 'grafico'],
        default: 'detalhado'
    },
    geradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    observacoes: String
}, {
    timestamps: true
});

// Método para calcular totalizadores
reportSchema.methods.calcularTotalizadores = function() {
    let custoTotalManutencao = 0;
    let receitaTotal = 0;
    let horasTotaisUso = 0;
    let depreciacaoTotal = 0;

    this.equipamentos.forEach(equip => {
        custoTotalManutencao += equip.metricas.custosManutencao || 0;
        receitaTotal += equip.metricas.receitaGerada || 0;
        horasTotaisUso += equip.metricas.horasUtilizadas || 0;
        depreciacaoTotal += equip.metricas.valorDepreciado || 0;
    });

    this.totalizadores = {
        custoTotalManutencao,
        receitaTotal,
        horasTotaisUso,
        depreciacaoTotal,
        taxaOcupacao: this.calcularTaxaOcupacao()
    };
};

// Método para calcular taxa de ocupação
reportSchema.methods.calcularTaxaOcupacao = function() {
    const diasPeriodo = (this.periodoFim - this.periodoInicio) / (1000 * 60 * 60 * 24);
    const diasUtilizadosTotal = this.equipamentos.reduce((total, equip) => 
        total + (equip.metricas.diasUtilizados || 0), 0);
    
    return (diasUtilizadosTotal / (diasPeriodo * this.equipamentos.length)) * 100;
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 
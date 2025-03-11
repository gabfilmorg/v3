const Report = require('../models/Report');
const Equipment = require('../models/Equipment');
const Project = require('../models/Project');

// Gerar relatório
exports.generateReport = async (req, res) => {
    try {
        const {
            tipo,
            periodoInicio,
            periodoFim,
            filtros,
            formato
        } = req.body;

        // Buscar equipamentos baseado nos filtros
        let query = {};
        if (filtros?.tipos) query.type = { $in: filtros.tipos };
        if (filtros?.status) query.status = { $in: filtros.status };

        const equipamentos = await Equipment.find(query)
            .populate('currentAssignment.project')
            .populate('maintenanceHistory');

        // Processar dados para cada equipamento
        const equipamentosProcessados = await Promise.all(equipamentos.map(async (equip) => {
            const metricas = await calcularMetricas(equip, periodoInicio, periodoFim);
            return {
                equipamento: equip._id,
                metricas
            };
        }));

        // Criar relatório
        const report = new Report({
            tipo,
            periodoInicio: new Date(periodoInicio),
            periodoFim: new Date(periodoFim),
            equipamentos: equipamentosProcessados,
            filtros,
            formato,
            geradoPor: req.user._id
        });

        // Calcular totalizadores
        report.calcularTotalizadores();

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar relatórios
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('geradoPor', 'name email')
            .populate('equipamentos.equipamento', 'name type brand model')
            .sort('-dataCriacao');
        
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter relatório específico
exports.getReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('geradoPor', 'name email')
            .populate('equipamentos.equipamento')
            .populate('equipamentos.metricas.projetosUtilizados.projeto');
            
        if (!report) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }
        
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Funções auxiliares
async function calcularMetricas(equipamento, inicio, fim) {
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
    
    // Calcular dias e horas utilizados
    const assignments = equipamento.currentAssignment || [];
    let horasUtilizadas = 0;
    let diasUtilizados = 0;
    let projetosUtilizados = [];
    
    // Processar atribuições no período
    if (assignments.startDate && assignments.endDate) {
        const assignmentInicio = new Date(assignments.startDate);
        const assignmentFim = new Date(assignments.endDate);
        
        if (assignmentInicio <= fimDate && assignmentFim >= inicioDate) {
            const overlapInicio = Math.max(assignmentInicio, inicioDate);
            const overlapFim = Math.min(assignmentFim, fimDate);
            
            const horasOverlap = (overlapFim - overlapInicio) / (1000 * 60 * 60);
            horasUtilizadas += horasOverlap;
            diasUtilizados += horasOverlap / 24;
            
            if (assignments.project) {
                projetosUtilizados.push({
                    projeto: assignments.project,
                    horasUtilizadas: horasOverlap,
                    valorCobrado: calcularValorCobrado(equipamento, horasOverlap)
                });
            }
        }
    }
    
    // Calcular custos de manutenção
    const manutencoes = equipamento.maintenanceHistory.filter(m => 
        new Date(m.date) >= inicioDate && new Date(m.date) <= fimDate
    );
    
    const custosManutencao = manutencoes.reduce((total, m) => total + (m.cost || 0), 0);
    
    // Calcular depreciação
    const valorDepreciado = equipamento.calculateDepreciation();
    
    // Calcular receita gerada
    const receitaGerada = projetosUtilizados.reduce((total, p) => total + p.valorCobrado, 0);
    
    return {
        diasUtilizados,
        horasUtilizadas,
        custosManutencao,
        valorDepreciado,
        receitaGerada,
        projetosUtilizados,
        manutencoes
    };
}

function calcularValorCobrado(equipamento, horas) {
    // Valor base por hora do equipamento
    const valorHora = equipamento.purchasePrice * 0.001; // 0.1% do valor do equipamento por hora
    return valorHora * horas;
}

// Exportar relatório em diferentes formatos
exports.exportReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('equipamentos.equipamento')
            .populate('equipamentos.metricas.projetosUtilizados.projeto');
            
        if (!report) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }

        const formato = req.query.formato || 'json';
        
        switch (formato) {
            case 'json':
                res.json(report);
                break;
                
            case 'csv':
                const csv = gerarCSV(report);
                res.header('Content-Type', 'text/csv');
                res.attachment(`relatorio_${report._id}.csv`);
                res.send(csv);
                break;
                
            case 'pdf':
                // Implementar geração de PDF
                res.status(501).json({ error: 'Formato PDF em desenvolvimento' });
                break;
                
            default:
                res.status(400).json({ error: 'Formato não suportado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function gerarCSV(report) {
    let csv = 'Equipamento,Dias Utilizados,Horas Utilizadas,Custos Manutenção,Valor Depreciado,Receita Gerada\n';
    
    report.equipamentos.forEach(equip => {
        csv += `${equip.equipamento.name},${equip.metricas.diasUtilizados},${equip.metricas.horasUtilizadas},${equip.metricas.custosManutencao},${equip.metricas.valorDepreciado},${equip.metricas.receitaGerada}\n`;
    });
    
    return csv;
} 
const NotificationTemplate = require('../models/NotificationTemplate');
const Notification = require('../models/Notification');

// Criar template
exports.criarTemplate = async (req, res) => {
    try {
        const template = new NotificationTemplate({
            ...req.body,
            criadoPor: req.user._id
        });
        
        await template.save();
        res.status(201).json(template);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar templates
exports.listarTemplates = async (req, res) => {
    try {
        const query = { ativo: true };
        
        if (req.query.categoria) {
            query.categoria = req.query.categoria;
        }
        if (req.query.tipo) {
            query.tipo = req.query.tipo;
        }
        
        const templates = await NotificationTemplate.find(query)
            .populate('criadoPor', 'name email')
            .sort('nome');
            
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter template específico
exports.getTemplate = async (req, res) => {
    try {
        const template = await NotificationTemplate.findById(req.params.id)
            .populate('criadoPor', 'name email');
            
        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }
        
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar template
exports.atualizarTemplate = async (req, res) => {
    try {
        const template = await NotificationTemplate.findById(req.params.id);
        
        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }
        
        Object.assign(template, req.body);
        await template.save();
        
        res.json(template);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Desativar template
exports.desativarTemplate = async (req, res) => {
    try {
        const template = await NotificationTemplate.findById(req.params.id);
        
        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }
        
        template.ativo = false;
        await template.save();
        
        res.json({ message: 'Template desativado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Criar notificação a partir de template
exports.criarNotificacaoDeTemplate = async (req, res) => {
    try {
        const { templateId, variaveis, destinatarios, referencias, dataAgendada, dataExpiracao } = req.body;
        
        const template = await NotificationTemplate.findById(templateId);
        
        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }
        
        // Validar variáveis
        template.validarVariaveis(variaveis);
        
        // Processar template
        const notificacaoProcessada = template.processarTemplate(variaveis);
        
        // Criar notificação
        const notificacao = new Notification({
            ...notificacaoProcessada,
            destinatarios: destinatarios.map(d => ({ usuario: d })),
            referencias,
            dataAgendada,
            dataExpiracao
        });
        
        await notificacao.save();
        res.status(201).json(notificacao);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Pré-visualizar template
exports.preVisualizarTemplate = async (req, res) => {
    try {
        const { templateId, variaveis } = req.body;
        
        const template = await NotificationTemplate.findById(templateId);
        
        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }
        
        try {
            template.validarVariaveis(variaveis);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
        
        const preVisualizacao = template.processarTemplate(variaveis);
        res.json(preVisualizacao);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
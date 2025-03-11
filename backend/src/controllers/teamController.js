const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

// Criar perfil de membro da equipe
exports.createTeamMember = async (req, res) => {
    try {
        // Verificar se já existe um perfil para este usuário
        const existingMember = await TeamMember.findOne({ user: req.body.user });
        if (existingMember) {
            return res.status(400).json({ error: 'Usuário já possui um perfil de equipe' });
        }

        const teamMember = await TeamMember.create(req.body);
        res.status(201).json(teamMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar membros da equipe
exports.getAllTeamMembers = async (req, res) => {
    try {
        const query = {};
        
        // Filtros
        if (req.query.specialty) {
            query.specialties = req.query.specialty;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.availability) {
            query['availability.status'] = req.query.availability;
        }

        // Busca por habilidades
        if (req.query.skill) {
            query['skills.skill'] = new RegExp(req.query.skill, 'i');
        }

        const teamMembers = await TeamMember.find(query)
            .populate('user', 'name email')
            .populate('equipments')
            .sort({ 'user.name': 1 });

        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter membro específico
exports.getTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id)
            .populate('user', 'name email')
            .populate('equipments')
            .populate('workHistory.project');

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        res.json(teamMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar membro
exports.updateTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        // Atualizar dados
        Object.assign(teamMember, req.body);
        await teamMember.save();

        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Deletar membro
exports.deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        await teamMember.remove();
        res.json({ message: 'Membro removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Adicionar período de indisponibilidade
exports.addUnavailablePeriod = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        teamMember.availability.unavailableDates.push(req.body);
        await teamMember.save();

        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Adicionar item ao portfólio
exports.addPortfolioItem = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        teamMember.portfolio.push(req.body);
        await teamMember.save();

        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Adicionar certificação
exports.addCertification = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        teamMember.certifications.push(req.body);
        await teamMember.save();

        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Registrar horas trabalhadas
exports.logWorkHours = async (req, res) => {
    try {
        const { projectId, hours, date } = req.body;
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        // Encontrar o registro de trabalho do projeto
        const workRecord = teamMember.workHistory.find(
            work => work.project.toString() === projectId
        );

        if (!workRecord) {
            return res.status(404).json({ error: 'Registro de trabalho não encontrado' });
        }

        workRecord.hoursWorked = (workRecord.hoursWorked || 0) + hours;
        await teamMember.save();

        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Avaliar desempenho
exports.evaluatePerformance = async (req, res) => {
    try {
        const { projectId, rating, feedback } = req.body;
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }

        const workRecord = teamMember.workHistory.find(
            work => work.project.toString() === projectId
        );

        if (!workRecord) {
            return res.status(404).json({ error: 'Registro de trabalho não encontrado' });
        }

        workRecord.performance = { rating, feedback };
        await teamMember.save();

        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar membros disponíveis
exports.findAvailableMembers = async (req, res) => {
    try {
        const { startDate, endDate, specialty } = req.query;
        
        const query = {
            'availability.status': { $ne: 'indisponivel' },
            'status': 'ativo'
        };

        if (specialty) {
            query.specialties = specialty;
        }

        const teamMembers = await TeamMember.find(query);

        // Filtrar membros disponíveis no período
        const availableMembers = teamMembers.filter(member => 
            member.isAvailable(new Date(startDate), new Date(endDate))
        );

        res.json(availableMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
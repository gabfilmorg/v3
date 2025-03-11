const Project = require('../models/Project');

// Criar novo projeto
exports.createProject = async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            createdBy: req.user.id,
            manager: req.body.manager || req.user.id
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todos os projetos
exports.getAllProjects = async (req, res) => {
    try {
        const query = {};
        
        // Filtros
        if (req.query.status) query.status = req.query.status;
        if (req.query.type) query.type = req.query.type;
        if (req.query.client) query.client = new RegExp(req.query.client, 'i');
        
        // Filtro de data
        if (req.query.startDate) {
            query.startDate = { $gte: new Date(req.query.startDate) };
        }
        if (req.query.endDate) {
            query.endDate = { $lte: new Date(req.query.endDate) };
        }

        // Permissões baseadas em role
        if (req.user.role === 'user') {
            query.$or = [
                { 'team.member': req.user.id },
                { manager: req.user.id },
                { createdBy: req.user.id }
            ];
        }

        const projects = await Project.find(query)
            .populate('manager', 'name email')
            .populate('team.member', 'name email')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter projeto específico
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('manager', 'name email')
            .populate('team.member', 'name email')
            .populate('tasks.assignedTo', 'name email');

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar projeto
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        // Verificar permissões
        if (req.user.role !== 'admin' && 
            project.manager.toString() !== req.user.id && 
            project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Sem permissão para atualizar este projeto' });
        }

        // Atualizar projeto
        Object.assign(project, req.body);
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Deletar projeto
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        // Verificar permissões
        if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Sem permissão para deletar este projeto' });
        }

        await project.remove();
        res.json({ message: 'Projeto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Adicionar membro à equipe
exports.addTeamMember = async (req, res) => {
    try {
        const { memberId, role } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        // Verificar se o membro já está na equipe
        if (project.team.some(member => member.member.toString() === memberId)) {
            return res.status(400).json({ error: 'Membro já está na equipe' });
        }

        project.team.push({ member: memberId, role });
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remover membro da equipe
exports.removeTeamMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        project.team = project.team.filter(member => member.member.toString() !== memberId);
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Adicionar tarefa
exports.addTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        project.tasks.push(req.body);
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Atualizar status da tarefa
exports.updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        const task = project.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        task.status = status;
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Adicionar marco
exports.addMilestone = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        project.milestones.push(req.body);
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Atualizar marco
exports.updateMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        const milestone = project.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({ error: 'Marco não encontrado' });
        }

        Object.assign(milestone, req.body);
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 
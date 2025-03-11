const Equipment = require('../models/Equipment');

// Criar novo equipamento
exports.createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todos os equipamentos
exports.getAllEquipments = async (req, res) => {
    try {
        const query = {};
        
        // Filtros
        if (req.query.type) query.type = req.query.type;
        if (req.query.status) query.status = req.query.status;
        if (req.query.brand) query.brand = new RegExp(req.query.brand, 'i');
        
        const equipments = await Equipment.find(query)
            .populate('currentAssignment.project', 'name')
            .populate('currentAssignment.assignedTo', 'user');
            
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter equipamento específico
exports.getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate('currentAssignment.project', 'name')
            .populate('currentAssignment.assignedTo', 'user');
            
        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado' });
        }
        
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar equipamento
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado' });
        }
        
        res.json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Deletar equipamento
exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado' });
        }
        
        res.json({ message: 'Equipamento removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atribuir equipamento
exports.assignEquipment = async (req, res) => {
    try {
        const { projectId, teamMemberId, startDate, endDate } = req.body;
        const equipment = await Equipment.findById(req.params.id);
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado' });
        }
        
        if (!equipment.isAvailable(new Date(startDate), new Date(endDate))) {
            return res.status(400).json({ error: 'Equipamento não disponível neste período' });
        }
        
        equipment.currentAssignment = {
            project: projectId,
            assignedTo: teamMemberId,
            startDate,
            endDate
        };
        equipment.status = 'em_uso';
        
        await equipment.save();
        res.json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Registrar manutenção
exports.logMaintenance = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado' });
        }
        
        equipment.maintenanceHistory.push(req.body);
        equipment.status = 'manutencao';
        
        await equipment.save();
        res.json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar equipamentos disponíveis
exports.findAvailableEquipments = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        
        const query = {
            status: 'disponivel'
        };
        
        if (type) query.type = type;
        
        const equipments = await Equipment.find(query);
        
        const availableEquipments = equipments.filter(equipment =>
            equipment.isAvailable(new Date(startDate), new Date(endDate))
        );
        
        res.json(availableEquipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
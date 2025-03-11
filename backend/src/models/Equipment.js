const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['camera', 'lente', 'audio', 'iluminacao', 'estabilizador', 'drone', 'acessorio', 'outro'],
        required: true
    },
    brand: String,
    model: String,
    serialNumber: String,
    purchaseDate: Date,
    purchasePrice: Number,
    status: {
        type: String,
        enum: ['disponivel', 'em_uso', 'manutencao', 'inativo'],
        default: 'disponivel'
    },
    specifications: {
        type: Map,
        of: String
    },
    maintenanceHistory: [{
        date: Date,
        type: String,
        description: String,
        cost: Number,
        technician: String,
        nextMaintenanceDate: Date
    }],
    currentAssignment: {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TeamMember'
        },
        startDate: Date,
        endDate: Date
    },
    notes: String,
    insurance: {
        provider: String,
        policyNumber: String,
        expiryDate: Date,
        coverage: String
    }
}, {
    timestamps: true
});

// Método para verificar disponibilidade
equipmentSchema.methods.isAvailable = function(startDate, endDate) {
    if (this.status !== 'disponivel') return false;
    
    if (!this.currentAssignment) return true;
    
    return !(startDate <= this.currentAssignment.endDate && 
             endDate >= this.currentAssignment.startDate);
};

// Método para calcular depreciação
equipmentSchema.methods.calculateDepreciation = function(years = 5) {
    if (!this.purchasePrice || !this.purchaseDate) return 0;
    
    const age = (new Date() - this.purchaseDate) / (1000 * 60 * 60 * 24 * 365);
    const annualDepreciation = this.purchasePrice / years;
    
    return Math.max(0, this.purchasePrice - (age * annualDepreciation));
};

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment; 
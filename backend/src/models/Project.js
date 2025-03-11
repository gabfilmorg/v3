const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Descrição é obrigatória']
    },
    client: {
        type: String,
        required: [true, 'Cliente é obrigatório'],
        trim: true
    },
    status: {
        type: String,
        enum: ['planejamento', 'em_andamento', 'em_pausa', 'concluido', 'cancelado'],
        default: 'planejamento'
    },
    type: {
        type: String,
        enum: ['filme', 'documentario', 'comercial', 'videoclipe', 'ensaio_fotografico', 'outro'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    budget: {
        total: {
            type: Number,
            required: true
        },
        spent: {
            type: Number,
            default: 0
        }
    },
    team: [{
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            required: true
        },
        hoursAllocated: {
            type: Number,
            default: 0
        }
    }],
    equipment: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment'
        },
        quantity: {
            type: Number,
            required: true
        },
        dateRange: {
            start: Date,
            end: Date
        }
    }],
    milestones: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        dueDate: Date,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    tasks: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pendente', 'em_andamento', 'concluida'],
            default: 'pendente'
        },
        priority: {
            type: String,
            enum: ['baixa', 'media', 'alta'],
            default: 'media'
        },
        dueDate: Date
    }],
    files: [{
        name: String,
        url: String,
        type: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Método para calcular o progresso do projeto
projectSchema.methods.calculateProgress = function() {
    if (!this.tasks || this.tasks.length === 0) return 0;
    
    const completedTasks = this.tasks.filter(task => task.status === 'concluida').length;
    return (completedTasks / this.tasks.length) * 100;
};

// Método para verificar se o projeto está atrasado
projectSchema.methods.isDelayed = function() {
    const now = new Date();
    const progress = this.calculateProgress();
    
    if (now > this.endDate && progress < 100) return true;
    
    // Calcula o progresso esperado baseado no tempo decorrido
    const totalDuration = this.endDate - this.startDate;
    const elapsed = now - this.startDate;
    const expectedProgress = (elapsed / totalDuration) * 100;
    
    return progress < expectedProgress - 20; // 20% de tolerância
};

// Método para calcular o orçamento restante
projectSchema.methods.getRemainingBudget = function() {
    return this.budget.total - this.budget.spent;
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 
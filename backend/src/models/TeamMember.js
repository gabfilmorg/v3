const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialties: [{
        type: String,
        enum: [
            'diretor',
            'produtor',
            'camera',
            'audio',
            'iluminacao',
            'editor',
            'fotografo',
            'drone',
            'assistente',
            'maquiador',
            'outro'
        ]
    }],
    availability: {
        status: {
            type: String,
            enum: ['disponivel', 'parcial', 'indisponivel'],
            default: 'disponivel'
        },
        unavailableDates: [{
            startDate: Date,
            endDate: Date,
            reason: String
        }]
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    equipments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment'
    }],
    skills: [{
        skill: String,
        level: {
            type: Number,
            min: 1,
            max: 5
        }
    }],
    certifications: [{
        name: String,
        issuer: String,
        dateObtained: Date,
        expiryDate: Date,
        document: String // URL do documento
    }],
    portfolio: [{
        title: String,
        description: String,
        role: String,
        date: Date,
        mediaUrl: String,
        projectType: {
            type: String,
            enum: ['filme', 'documentario', 'comercial', 'videoclipe', 'ensaio_fotografico', 'outro']
        }
    }],
    workHistory: [{
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        role: String,
        startDate: Date,
        endDate: Date,
        hoursWorked: Number,
        performance: {
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            feedback: String
        }
    }],
    contacts: {
        phone: String,
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String
        }
    },
    bankInfo: {
        bank: String,
        accountType: String,
        accountNumber: String,
        agency: String,
        pixKey: String
    },
    documents: {
        cpf: String,
        rg: String,
        cnpj: String,
        mei: String
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'ferias', 'licenca'],
        default: 'ativo'
    }
}, {
    timestamps: true
});

// Método para verificar disponibilidade em um período
teamMemberSchema.methods.isAvailable = function(startDate, endDate) {
    // Se estiver indisponível globalmente
    if (this.availability.status === 'indisponivel') return false;

    // Verifica conflitos com datas indisponíveis
    const hasConflict = this.availability.unavailableDates.some(period => {
        return (startDate <= period.endDate) && (endDate >= period.startDate);
    });

    return !hasConflict;
};

// Método para calcular horas trabalhadas em um período
teamMemberSchema.methods.getHoursWorked = function(startDate, endDate) {
    const relevantWork = this.workHistory.filter(work => {
        return (work.startDate <= endDate) && (work.endDate >= startDate);
    });

    return relevantWork.reduce((total, work) => total + (work.hoursWorked || 0), 0);
};

// Método para calcular avaliação média
teamMemberSchema.methods.getAverageRating = function() {
    const ratings = this.workHistory
        .filter(work => work.performance && work.performance.rating)
        .map(work => work.performance.rating);

    if (ratings.length === 0) return 0;

    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember; 
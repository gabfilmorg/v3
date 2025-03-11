const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
require('dotenv').config();

const equipments = [
    // Câmeras
    {
        name: 'Canon EOS R5',
        type: 'camera',
        brand: 'Canon',
        model: 'EOS R5',
        specifications: {
            sensor: 'Full-frame 45MP',
            video: '8K RAW, 4K 120fps',
            estabilizacao: '5-axis IBIS'
        },
        purchasePrice: 15000.00,
        status: 'disponivel'
    },
    {
        name: 'Sony FX3',
        type: 'camera',
        brand: 'Sony',
        model: 'FX3',
        specifications: {
            sensor: 'Full-frame 12.1MP',
            video: '4K 120fps, 1080p 240fps',
            estabilizacao: '5-axis IBIS'
        },
        purchasePrice: 18000.00,
        status: 'disponivel'
    },
    
    // Lentes
    {
        name: 'Canon RF 24-70mm f/2.8L',
        type: 'lente',
        brand: 'Canon',
        model: 'RF 24-70mm f/2.8L USM',
        specifications: {
            focalLength: '24-70mm',
            aperture: 'f/2.8',
            mount: 'Canon RF'
        },
        purchasePrice: 9000.00,
        status: 'disponivel'
    },
    {
        name: 'Sony G Master 16-35mm f/2.8',
        type: 'lente',
        brand: 'Sony',
        model: 'FE 16-35mm f/2.8 GM',
        specifications: {
            focalLength: '16-35mm',
            aperture: 'f/2.8',
            mount: 'Sony E'
        },
        purchasePrice: 8500.00,
        status: 'disponivel'
    },
    
    // Equipamentos de Áudio
    {
        name: 'Rode NTG5',
        type: 'audio',
        brand: 'Rode',
        model: 'NTG5',
        specifications: {
            type: 'Shotgun Microphone',
            pattern: 'Super-Cardioid',
            frequency: '20Hz - 20kHz'
        },
        purchasePrice: 3000.00,
        status: 'disponivel'
    },
    {
        name: 'Sennheiser G4 Wireless',
        type: 'audio',
        brand: 'Sennheiser',
        model: 'EW 100 G4',
        specifications: {
            type: 'Wireless Lavalier System',
            frequency: '516-558 MHz',
            range: '100m'
        },
        purchasePrice: 4000.00,
        status: 'disponivel'
    },
    
    // Iluminação
    {
        name: 'Aputure LS 600d Pro',
        type: 'iluminacao',
        brand: 'Aputure',
        model: 'LS 600d Pro',
        specifications: {
            power: '600W',
            temperature: '5600K',
            control: 'DMX/Wireless'
        },
        purchasePrice: 7000.00,
        status: 'disponivel'
    },
    {
        name: 'Godox VL300',
        type: 'iluminacao',
        brand: 'Godox',
        model: 'VL300',
        specifications: {
            power: '300W',
            temperature: '5600K',
            control: 'DMX/App'
        },
        purchasePrice: 3500.00,
        status: 'disponivel'
    },
    
    // Estabilizadores
    {
        name: 'DJI Ronin 4D',
        type: 'estabilizador',
        brand: 'DJI',
        model: 'Ronin 4D',
        specifications: {
            axes: '4-axis',
            payload: '4.6kg',
            features: 'LiDAR focusing'
        },
        purchasePrice: 12000.00,
        status: 'disponivel'
    },
    {
        name: 'Zhiyun Crane 3S',
        type: 'estabilizador',
        brand: 'Zhiyun',
        model: 'Crane 3S',
        specifications: {
            axes: '3-axis',
            payload: '6.5kg',
            features: 'ViaTouch 2.0'
        },
        purchasePrice: 5000.00,
        status: 'disponivel'
    },
    
    // Drones
    {
        name: 'DJI Mavic 3 Pro',
        type: 'drone',
        brand: 'DJI',
        model: 'Mavic 3 Pro',
        specifications: {
            camera: 'Hasselblad 4/3 CMOS',
            video: '5.1K 50fps',
            flightTime: '46 minutes'
        },
        purchasePrice: 12000.00,
        status: 'disponivel'
    },
    
    // Acessórios
    {
        name: 'SmallRig Cage para Sony FX3',
        type: 'acessorio',
        brand: 'SmallRig',
        model: 'Cage FX3',
        specifications: {
            material: 'Alumínio',
            compatibility: 'Sony FX3',
            features: 'NATO rails, cold shoe mounts'
        },
        purchasePrice: 800.00,
        status: 'disponivel'
    },
    {
        name: 'Atomos Ninja V+',
        type: 'acessorio',
        brand: 'Atomos',
        model: 'Ninja V+',
        specifications: {
            screen: '5" HDR',
            recording: '8K ProRes RAW',
            storage: 'SSD'
        },
        purchasePrice: 5000.00,
        status: 'disponivel'
    },
    // Novas câmeras
    {
        name: 'Blackmagic Pocket 6K Pro',
        type: 'camera',
        brand: 'Blackmagic',
        model: 'Pocket Cinema Camera 6K Pro',
        specifications: {
            sensor: 'Super 35 6K',
            video: '6K 50fps, 4K 120fps',
            iso: 'Dual Native ISO'
        },
        purchasePrice: 16000.00,
        status: 'disponivel'
    },
    {
        name: 'Panasonic GH6',
        type: 'camera',
        brand: 'Panasonic',
        model: 'Lumix GH6',
        specifications: {
            sensor: 'M4/3 25.2MP',
            video: '5.7K 60fps, 4K 120fps',
            estabilizacao: '7-stop IBIS'
        },
        purchasePrice: 12000.00,
        status: 'disponivel'
    },
    // Novas lentes
    {
        name: 'Sigma 85mm f/1.4 DG DN Art',
        type: 'lente',
        brand: 'Sigma',
        model: '85mm f/1.4 DG DN Art',
        specifications: {
            focalLength: '85mm',
            aperture: 'f/1.4',
            mount: 'Sony E/L-Mount'
        },
        purchasePrice: 6000.00,
        status: 'disponivel'
    },
    {
        name: 'Canon RF 70-200mm f/2.8L',
        type: 'lente',
        brand: 'Canon',
        model: 'RF 70-200mm f/2.8L IS USM',
        specifications: {
            focalLength: '70-200mm',
            aperture: 'f/2.8',
            mount: 'Canon RF'
        },
        purchasePrice: 12000.00,
        status: 'disponivel'
    },
    // Novo áudio
    {
        name: 'Zoom H8',
        type: 'audio',
        brand: 'Zoom',
        model: 'H8',
        specifications: {
            channels: '12 inputs',
            recording: '96kHz/24-bit',
            features: 'Touchscreen Interface'
        },
        purchasePrice: 3500.00,
        status: 'disponivel'
    },
    {
        name: 'Shure SM7B',
        type: 'audio',
        brand: 'Shure',
        model: 'SM7B',
        specifications: {
            type: 'Dynamic Microphone',
            pattern: 'Cardioid',
            usage: 'Vocal/Podcast'
        },
        purchasePrice: 2500.00,
        status: 'disponivel'
    },
    // Nova iluminação
    {
        name: 'Nanlite Forza 500',
        type: 'iluminacao',
        brand: 'Nanlite',
        model: 'Forza 500',
        specifications: {
            power: '500W',
            temperature: '5600K',
            cri: '98'
        },
        purchasePrice: 6000.00,
        status: 'disponivel'
    },
    {
        name: 'Godox ML60',
        type: 'iluminacao',
        brand: 'Godox',
        model: 'ML60',
        specifications: {
            power: '60W',
            temperature: '5600K',
            features: 'Portátil/Bateria'
        },
        purchasePrice: 2000.00,
        status: 'disponivel'
    },
    // Novo estabilizador
    {
        name: 'DJI RS 3 Pro',
        type: 'estabilizador',
        brand: 'DJI',
        model: 'RS 3 Pro',
        specifications: {
            axes: '3-axis',
            payload: '4.5kg',
            features: 'SuperSmooth/AI'
        },
        purchasePrice: 4500.00,
        status: 'disponivel'
    },
    // Novo drone
    {
        name: 'DJI FPV Combo',
        type: 'drone',
        brand: 'DJI',
        model: 'FPV Combo',
        specifications: {
            camera: '4K 60fps',
            speed: '140 km/h',
            features: 'FPV Goggles V2'
        },
        purchasePrice: 7000.00,
        status: 'disponivel'
    },
    // Novos acessórios
    {
        name: 'DJI Focus Motor',
        type: 'acessorio',
        brand: 'DJI',
        model: 'Focus Motor',
        specifications: {
            compatibility: 'RS 2/RS 3 Pro',
            precision: '0.02 graus',
            control: 'Wireless'
        },
        purchasePrice: 1500.00,
        status: 'disponivel'
    },
    {
        name: 'Tilta Float Handheld',
        type: 'acessorio',
        brand: 'Tilta',
        model: 'Float Handheld',
        specifications: {
            type: 'Camera Support',
            payload: '3.6kg',
            features: 'Spring Arm System'
        },
        purchasePrice: 2000.00,
        status: 'disponivel'
    }
];

const seedEquipments = async () => {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado ao MongoDB');

        // Limpar equipamentos existentes
        await Equipment.deleteMany({});
        console.log('Equipamentos existentes removidos');

        // Inserir novos equipamentos
        await Equipment.insertMany(equipments);
        console.log('Novos equipamentos adicionados com sucesso');

        // Desconectar do MongoDB
        await mongoose.connection.close();
        console.log('Conexão com MongoDB fechada');

    } catch (error) {
        console.error('Erro ao semear equipamentos:', error);
        process.exit(1);
    }
};

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedEquipments();
}

module.exports = seedEquipments; 
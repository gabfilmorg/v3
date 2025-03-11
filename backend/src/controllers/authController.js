const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gerar Token JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// Registro de usuário
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Verificar se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Criar novo usuário
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        // Gerar token
        const token = generateToken(user._id);

        // Retornar usuário e token (sem a senha)
        user.password = undefined;
        res.status(201).json({
            user,
            token
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

// Login de usuário
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuário
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Verificar senha
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Verificar se usuário está ativo
        if (!user.active) {
            return res.status(401).json({ error: 'Usuário inativo' });
        }

        // Gerar token
        const token = generateToken(user._id);

        // Retornar usuário e token (sem a senha)
        user.password = undefined;
        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
};

// Atualizar perfil
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        // Retornar usuário atualizado (sem a senha)
        user.password = undefined;
        res.json(user);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
}; 
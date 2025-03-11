const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        // 1. Verificar se o token existe
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Acesso não autorizado' });
        }

        // 2. Verificar se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Verificar se o usuário ainda existe
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        // 4. Verificar se o usuário está ativo
        if (!user.active) {
            return res.status(401).json({ error: 'Usuário inativo' });
        }

        // 5. Conceder acesso à rota protegida
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// Middleware para verificar roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Você não tem permissão para acessar este recurso' 
            });
        }
        next();
    };
}; 
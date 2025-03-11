require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'filmorg-secret-key',
    expiresIn: '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'filmorg-refresh-secret-key',
    refreshExpiresIn: '7d'
}; 
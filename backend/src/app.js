require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        }));
    }

    routes() {
        this.app.use('/api', routes);
    }
}

module.exports = new App().app; 
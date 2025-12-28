require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./auth');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

// Environment validation
const requiredEnvVars = ['MONGO_URI', 'STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    logger.error('Missing required environment variables', null, { missing: missingEnvVars });
    process.exit(1);
}

// CORS Configuration - Use environment variable for frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
logger.info('CORS configured', { allowedOrigin: FRONTEND_URL });

app.use(express.json());
app.use(logger.requestLogger);
connectDB();

app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/activities', activityRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

app.use(errorHandler);

process.on('uncaughtException', err => {
    logger.error('Uncaught Exception', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', reason);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger.success(`Backend running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        frontendUrl: FRONTEND_URL,
    });
});

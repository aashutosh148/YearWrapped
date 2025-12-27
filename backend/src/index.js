process.on('uncaughtException', err => {
    console.error("[UNCAUGHT EXCEPTION]", err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error("[UNHANDLED REJECTION] at:", promise, "reason:", reason);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./auth');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/activities', activityRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`[SERVER] Backend running on port ${PORT}`));

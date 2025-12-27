const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    console.log('[AUTH] Incoming auth middleware call');
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token) {
        console.warn('[AUTH] Missing token');
        return res.status(401).json({ message: 'Missing token' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[AUTH] Token verified successfully. Payload athlete ID:', payload.athlete?.id);

        // Find user in DB to attach latest data and preferences
        const user = await User.findOne({ stravaId: payload.athlete.id });
        if (!user) {
            console.warn('[AUTH] User not found in database');
            return res.status(401).json({ message: 'User not registered' });
        }

        req.user = user;
        req.strava = payload; // Keep legacy payload access if needed
        next();
    } catch (e) {
        console.error('[AUTH] Invalid token:', e.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// GET current user info
router.get('/me', authMiddleware, (req, res) => {
    res.json({
        user: {
            id: req.user.stravaId,
            name: `${req.user.firstname} ${req.user.lastname}`.trim(),
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            avatar: req.user.profile,
            profile: req.user.profile,
        },
        preferences: req.user.preferences
    });
});

// PATCH update preferences
router.patch('/preferences', authMiddleware, async (req, res) => {
    try {
        const User = require('../models/User');
        const currentPrefs = req.user.preferences || {};
        const newPreferences = { ...currentPrefs, ...req.body };

        // Use direct update to bypass potential Mongoose Map casting issues on the document instance
        await User.updateOne(
            { stravaId: req.user.stravaId },
            { $set: { preferences: newPreferences } }
        );

        res.json({ success: true, preferences: newPreferences });
    } catch (err) {
        console.error('[ERROR] Update preferences failed:', err);
        res.status(500).json({ message: 'Failed to update preferences' });
    }
});

module.exports = router;

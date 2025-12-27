const express = require('express');
const jwt = require('jsonwebtoken');
const { exchangeCodeForToken } = require('./stravaClient');
const User = require('./models/User');
const router = express.Router();

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const REDIRECT_URI = process.env.STRAVA_CALLBACK_URL;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

// --- LOGIN ROUTE ---
router.get('/strava/login', (req, res) => {
    const scope = 'activity:read';
    const url = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&approval_prompt=auto&scope=${scope}`;
    res.redirect(url);
});

// --- CALLBACK ROUTE ---
router.get('/strava/callback', async (req, res) => {
    console.log('[AUTH] /strava/callback received query:', req.query);
    try {
        const { code } = req.query;
        if (!code) {
            console.warn('[AUTH] No code in callback query');
            return res.status(400).send('Missing code');
        }

        console.log('[AUTH] Exchanging code for token...');
        const tokenData = await exchangeCodeForToken(code, CLIENT_ID, CLIENT_SECRET);
        console.log('[AUTH] Token data received, athlete:', tokenData.athlete?.id);

        const { athlete, access_token, refresh_token, expires_at } = tokenData;

        if (!athlete || !athlete.id) {
            console.error('[AUTH ERROR] No athlete data in token response');
            return res.status(500).send('No athlete data');
        }

        console.log('[AUTH] Upserting user record in DB...');
        // Persist or update user
        const user = await User.findOneAndUpdate(
            { stravaId: athlete.id },
            {
                firstname: athlete.firstname,
                lastname: athlete.lastname,
                profile: athlete.profile,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: expires_at,
            },
            { upsert: true, new: true }
        );
        console.log('[AUTH] User record updated:', user.stravaId);

        const payload = {
            athlete: {
                id: user.stravaId,
                name: `${user.firstname} ${user.lastname}`.trim(),
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.profile
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?token=${token}`;
        console.log('[AUTH] Redirecting to frontend:', redirectUrl);

        res.redirect(redirectUrl);
    } catch (err) {
        console.error('[AUTH ERROR] OAuth callback failed:', err.message, err.stack);
        res.status(500).send('Auth failed: ' + err.message);
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Activity = require('../models/UserActivity');
const { fetchActivities } = require('../stravaClient');

// Helper to format moving time (seconds) to "Xh Ym"
function formatMovingTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const { getBestEfforts } = require('../utils/stats');

/**
 * Format pace (seconds/meter) to "MM:SS/km"
 */
function formatPace(secPerMeter) {
    const secPerKm = secPerMeter * 1000;
    const m = Math.floor(secPerKm / 60);
    const s = Math.round(secPerKm % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// GET activities for the dashboard stats
router.get('/', authMiddleware, async (req, res) => {
    try {
        const allActivities = await Activity.find({ athleteId: req.user.stravaId }).sort({ start_date: -1 });

        // Filter for Runs only as per new requirements
        const activities = allActivities.filter(a => a.type === 'Run');

        if (activities.length === 0) {
            return res.json({
                activities: [],
                stats: {
                    year: 2025,
                    totalDistance: "0",
                    distanceUnit: "km",
                    totalActivities: 0,
                    totalTime: "0h 0m",
                    heatmap: new Array(12).fill(0),
                    longestRun: { distance: "0 km", date: "-" },
                    bestEfforts: {}
                }
            });
        }

        const totalDistance = activities.reduce((sum, a) => sum + (a.distance || 0), 0);
        const totalTime = activities.reduce((sum, a) => sum + (a.moving_time || 0), 0);

        // Heatmap (activities per month)
        const heatmap = new Array(12).fill(0);
        activities.forEach(a => {
            const month = new Date(a.start_date).getMonth();
            heatmap[month]++;
        });
        // Normalize heatmap (0.1 to 1.0)
        const maxActivities = Math.max(...heatmap) || 1;
        const normalizedHeatmap = heatmap.map(count => count > 0 ? 0.1 + (count / maxActivities) * 0.9 : 0);

        // Longest run
        const longest = [...activities].sort((a, b) => b.distance - a.distance)[0];

        // Calculate best efforts including dynamic user distances
        const defaultDistances = [
            { id: 'pb5k', name: '5k', meters: 5000 },
            { id: 'pb10k', name: '10k', meters: 10000 },
            { id: 'pbHalf', name: 'Half-Marathon', meters: 21097.5 },
            { id: 'pbFull', name: 'Marathon', meters: 42195 }
        ];

        const preferredDistances = req.user.preferences?.bestEffortDistances || defaultDistances;
        const bestEfforts = getBestEfforts(activities, preferredDistances);

        // Format response to match mockData exactly
        res.json({
            activities: activities.slice(0, 10), // Send latest 10 runs
            stats: {
                year: 2025,
                totalDistance: (totalDistance / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }),
                distanceUnit: "km",
                totalActivities: activities.length,
                totalTime: formatMovingTime(totalTime),
                longestRun: {
                    distance: `${(longest.distance / 1000).toFixed(1)} km`,
                    date: new Date(longest.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                },
                heatmap: normalizedHeatmap,
                bestEfforts,
                // Legacy / Compat support
                ...bestEfforts
            }
        });
    } catch (err) {
        console.error('[ERROR] Fetch activities failed:', err);
        res.status(500).json({ message: 'Failed to fetch activities' });
    }
});

// POST sync with Strava
router.post('/sync', authMiddleware, async (req, res) => {
    console.log('[API] /sync called by athlete:', req.user.stravaId);

    try {
        // Fetch 2025 specifically as per requirements
        const after = Math.floor(new Date('2025-01-01T00:00:00Z') / 1000);
        const before = Math.floor(new Date('2026-01-01T00:00:00Z') / 1000);

        let accessToken = req.user.accessToken;
        // NOTE: Refresh token logic should be handled if token expired, but using current for now

        console.log('[STRAVA] Fetching activities from Strava...');
        const activities = await fetchActivities(accessToken, after, before);
        console.log(`[STRAVA] Received ${activities.length} activities.`);

        for (const act of activities) {
            const doc = {
                stravaId: act.id,
                athleteId: act.athlete?.id,
                name: act.name,
                type: act.type,
                distance: act.distance,
                moving_time: act.moving_time,
                elapsed_time: act.elapsed_time,
                start_date: new Date(act.start_date),
                summary_polyline: act.map?.summary_polyline || act.map?.polyline || null,
                raw: act,
            };

            await Activity.updateOne({ stravaId: act.id }, { $set: doc }, { upsert: true });
        }

        res.json({ success: true, count: activities.length });
    } catch (err) {
        console.error('[ERROR] Sync failed:', err);
        res.status(500).json({ message: 'Sync failed' });
    }
});

module.exports = router;

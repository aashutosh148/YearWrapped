function formatTime(seconds) {
    if (!seconds) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);

    const mmss = `${m.toString().padStart(h > 0 ? 2 : 1, '0')}:${s.toString().padStart(2, '0')}`;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : mmss;
}

function getBestEfforts(activities, distances = []) {
    const results = {};

    // Initialize results with id as key
    distances.forEach(d => results[d.id] = { time: Infinity, formatted: '-' });

    activities.forEach(activity => {
        // Only consider Runs for best efforts
        if (activity.type !== 'Run') return;

        // --- Step 1: Check Strava Native Best Efforts ---
        const nativeEfforts = activity.raw?.best_efforts;
        if (Array.isArray(nativeEfforts)) {
            nativeEfforts.forEach(effort => {
                // Strava names can be "5k", "10k", "Half Marathon", "Marathon"
                // We need to match these to our dynamic list
                // We'll match by name or by a normalized version of the name
                const matchedDist = distances.find(d =>
                    d.name.toLowerCase() === effort.name.toLowerCase() ||
                    (d.id === 'pbHalf' && effort.name === 'Half Marathon') ||
                    (d.id === 'pbFull' && effort.name === 'Marathon')
                );

                if (matchedDist) {
                    if (effort.moving_time < results[matchedDist.id].time) {
                        results[matchedDist.id] = {
                            time: effort.moving_time,
                            formatted: formatTime(effort.moving_time)
                        };
                    }
                }
            });
        }

        // --- Step 2: Fallback Logic (Estimation) ---
        distances.forEach(d => {
            const targetMeters = d.meters;
            if (!targetMeters) return;

            // If the activity is long enough
            if (activity.distance >= targetMeters) {
                const estimatedTime = (activity.moving_time / activity.distance) * targetMeters;

                if (estimatedTime < results[d.id].time) {
                    results[d.id] = {
                        time: estimatedTime,
                        formatted: formatTime(estimatedTime)
                    };
                }
            }
        });
    });

    // Extract just the formatted strings
    const finalResults = {};
    distances.forEach(d => {
        finalResults[d.id] = results[d.id].formatted;
    });

    return finalResults;
}

module.exports = {
    formatTime,
    getBestEfforts
};

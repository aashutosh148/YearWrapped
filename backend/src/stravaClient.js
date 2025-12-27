const axios = require('axios');

const STRAVA_BASE = 'https://www.strava.com/api/v3';
console.log('[STRAVA INIT] Strava client initialized with base URL:', STRAVA_BASE);

// --- Exchange OAuth Code for Access Token ---
async function exchangeCodeForToken(code, clientId, clientSecret) {
  console.log('[STRAVA] Exchanging code for token...');
  console.log('[STRAVA] Params:', { code, clientId, clientSecret: clientSecret?.slice(0, 6) + '***' });

  try {
    const resp = await axios.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    });
    console.log('[STRAVA] Token exchange response:', resp.data);
    return resp.data;
  } catch (err) {
    console.error('[STRAVA ERROR] Token exchange failed:', err.response?.data || err.message);
    throw err;
  }
}

// --- Refresh Token Flow ---
async function refreshToken(refresh_token, clientId, clientSecret) {
  console.log('[STRAVA] Refreshing token...');
  console.log('[STRAVA] Params:', { refresh_token, clientId, clientSecret: clientSecret?.slice(0, 6) + '***' });

  try {
    const resp = await axios.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token,
    });
    console.log('[STRAVA] Token refresh response:', resp.data);
    return resp.data;
  } catch (err) {
    console.error('[STRAVA ERROR] Token refresh failed:', err.response?.data || err.message);
    throw err;
  }
}

// --- Fetch Activities between two epochs ---
async function fetchActivities(accessToken, afterEpoch, beforeEpoch) {
  console.log('[STRAVA] Fetching activities...');
  console.log('[STRAVA] Using AccessToken:', accessToken);
  console.log('[STRAVA] Epoch Range:', { afterEpoch, beforeEpoch });

  const per_page = 200;
  let page = 1;
  let all = [];

  try {
    while (true) {
      const url = `${STRAVA_BASE}/athlete/activities?after=${afterEpoch}&before=${beforeEpoch}&per_page=${per_page}&page=${page}`;
      console.log(`[STRAVA] Fetching page ${page}:`, url);

      const r = await axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      console.log(`[STRAVA] Page ${page} response length:`, r.data?.length);

      if (!Array.isArray(r.data) || r.data.length === 0) break;
      all = all.concat(r.data);

      if (r.data.length < per_page) break;
      page++;
    }
    console.log(`[STRAVA] Total activities fetched: ${all.length}`);
    return all;
  } catch (err) {
    console.error('[STRAVA ERROR] Failed to fetch activities:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { exchangeCodeForToken, refreshToken, fetchActivities };

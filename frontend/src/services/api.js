import { MOCK_DATA } from '../data/mockData.js';
import logger from '../utils/logger.js';


const USE_MOCK_DATA = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID || '';

class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

const httpClient = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const method = options.method || 'GET';

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request
        logger.apiRequest(method, endpoint, options.body);

        try {
            const response = await fetch(url, config);
            const data = await response.json().catch(() => null);

            // Log response
            logger.apiResponse(method, endpoint, response.status, data);

            if (!response.ok) {
                throw new ApiError(
                    data?.message || 'An error occurred',
                    response.status,
                    data
                );
            }

            return data;
        } catch (error) {
            logger.error(`API request failed: ${method} ${endpoint}`, error);
            if (error instanceof ApiError) throw error;
            throw new ApiError(error.message || 'Network error', 0);
        }
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        });
    },

    patch(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },
};

const realAdapter = {
    async getUser() {
        const response = await httpClient.get('/api/user/me');
        return response.user;
    },

    async getStats(year = 2025) {
        const response = await httpClient.get('/api/activities');
        return response.stats;
    },

    async getFullData() {
        try {
            const [userResponse, activityResponse] = await Promise.all([
                httpClient.get('/api/user/me'),
                httpClient.get('/api/activities'),
            ]);

            return {
                user: userResponse.user || {},
                stats: activityResponse.stats || {},
                activities: activityResponse.activities || [],
                preferences: userResponse.preferences || {}
            };
        } catch (err) {
            console.error('[API] getFullData failed:', err);
            throw err;
        }
    },

    async initiateStravaAuth() {
        // Redirect to backend auth login
        window.location.href = `${API_BASE_URL}/auth/strava/login`;
        return { success: true };
    },

    async handleStravaCallback(token) {
        if (token) {
            localStorage.setItem('auth_token', token);
            return this.getFullData();
        }
        throw new Error('No token provided');
    },

    async logout() {
        localStorage.removeItem('auth_token');
        return { success: true };
    },

    async refreshStats() {
        await httpClient.post('/api/activities/sync');
        return this.getStats();
    },

    async updatePreferences(preferences) {
        return httpClient.patch('/api/user/preferences', preferences);
    }
};

const adapter = realAdapter;

export const api = {
    // Auth
    initiateStravaAuth: () => adapter.initiateStravaAuth(),
    handleStravaCallback: (token) => adapter.handleStravaCallback(token),
    logout: () => adapter.logout(),

    // Data
    getUser: () => adapter.getUser(),
    getStats: (year) => adapter.getStats(year),
    getFullData: () => adapter.getFullData(),
    refreshStats: () => adapter.refreshStats(),
    updatePreferences: (prefs) => adapter.updatePreferences(prefs),

    // Utilities
    isAuthenticated: () => {
        return !!localStorage.getItem('auth_token');
    },
};

export { ApiError, USE_MOCK_DATA };
export default api;

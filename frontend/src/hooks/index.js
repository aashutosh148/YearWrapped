import { useState, useCallback, useEffect } from 'react';
import api from '../services/api.js';
import { DEFAULT_PREFERENCES, getTheme, getQuote } from '../config/storyPreferences.js';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const initAuth = useCallback(async (tokenFromUrl = null) => {
        setIsLoading(true);
        try {
            const token = tokenFromUrl || localStorage.getItem('auth_token');
            if (token) {
                if (tokenFromUrl) {
                    localStorage.setItem('auth_token', tokenFromUrl);
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                const userData = await api.getUser();
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.error('[AUTH ERROR]', err);
            setError(err.message);
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial auth check and URL token handling
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        initAuth(token);
    }, [initAuth]);

    const connect = useCallback(async () => {
        try {
            await api.initiateStravaAuth();
        } catch (err) {
            setError(err.message || 'Failed to connect to Strava');
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await api.logout();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isAuthenticated,
        isLoading,
        error,
        user,
        connect,
        logout,
        clearError: () => setError(null),
    };
};

// ============================================================================
// useStravaData - Fetch and manage Strava data
// ============================================================================

export const useStravaData = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await api.getFullData();
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Trigger sync on backend
            await api.refreshStats();
            // Refetch full data to get updated activities
            const result = await api.getFullData();
            setData(result);
            return result.stats;
        } catch (err) {
            setError(err.message || 'Failed to refresh stats');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        data,
        isLoading,
        error,
        fetchData,
        refreshStats,
        clearError: () => setError(null),
    };
};

// ============================================================================
// useStoryPreferences - Manage story customization preferences
// ============================================================================

const STORAGE_KEY = 'strava_story_preferences';

export const useStoryPreferences = () => {
    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

    // Initial load from local storage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setPreferences(prev => ({ ...prev, ...JSON.parse(saved) }));
            }
        } catch (e) {
            console.error('Failed to load preferences:', e);
        }
    }, [setPreferences]);

    // Persist to localStorage and backend on change
    const updatePreference = useCallback(async (key, value) => {
        const newPrefs = { ...preferences, [key]: value };
        setPreferences(newPrefs);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
            if (api.isAuthenticated()) {
                await api.updatePreferences({ [key]: value });
            }
        } catch (e) {
            console.error('Failed to save preferences:', e);
        }
    }, [preferences]);

    const updateSection = useCallback(async (sectionId, enabled) => {
        const newSections = { ...preferences.sections, [sectionId]: enabled };
        const newPrefs = { ...preferences, sections: newSections };
        setPreferences(newPrefs);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
            if (api.isAuthenticated()) {
                await api.updatePreferences({ sections: newSections });
            }
        } catch (e) {
            console.error('Failed to save preferences:', e);
        }
    }, [preferences]);

    const resetPreferences = useCallback(async () => {
        setPreferences(DEFAULT_PREFERENCES);
        localStorage.removeItem(STORAGE_KEY);
        if (api.isAuthenticated()) {
            await api.updatePreferences(DEFAULT_PREFERENCES);
        }
    }, []);

    // Computed values for easy access
    const theme = getTheme(preferences.theme);
    const quote = preferences.quote === 'custom'
        ? preferences.customQuote
        : getQuote(preferences.quote);

    return {
        preferences,
        theme,
        quote,
        updatePreference,
        updateSection,
        resetPreferences,
        setPreferences,
    };
};

// ============================================================================
// useDownload - Handle story download functionality
// ============================================================================

export const useDownload = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadSvg = useCallback((elementId, filename = 'strava-wrapped') => {
        setIsDownloading(true);

        try {
            const svgElement = document.getElementById(elementId);
            if (!svgElement) {
                throw new Error('SVG element not found');
            }

            const svgData = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;
        } catch (err) {
            console.error('Download failed:', err);
            return false;
        } finally {
            setIsDownloading(false);
        }
    }, []);

    const toDataURL = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.warn('Failed to convert image to data URL:', e);
            return url;
        }
    };

    const downloadPng = useCallback(async (elementId, filename = 'strava-wrapped') => {
        setIsDownloading(true);
        try {
            const svgElement = document.getElementById(elementId);
            if (!svgElement) throw new Error('SVG element not found');

            // Copy element to avoid mutating the live UI
            const clone = svgElement.cloneNode(true);

            // Inline all images (avatars, etc) for canvas rendering
            const images = clone.querySelectorAll('image');
            for (const img of images) {
                const href = img.getAttribute('href') || img.getAttribute('xlink:href');
                if (href && href.startsWith('http')) {
                    const dataUrl = await toDataURL(href);
                    img.setAttribute('href', dataUrl);
                }
            }

            // 1. Serialize SVG to XML
            const svgData = new XMLSerializer().serializeToString(clone);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // 2. Load into an Image
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });

            // 3. Draw to Canvas
            const canvas = document.createElement('canvas');
            canvas.width = 1080; // High res
            canvas.height = 1920;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 1080, 1920);

            // 4. Download as PNG
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `${filename}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            return true;
        } catch (err) {
            console.error('PNG Download failed:', err);
            return false;
        } finally {
            setIsDownloading(false);
        }
    }, []);

    return {
        isDownloading,
        downloadSvg,
        downloadPng,
    };
};

export default {
    useAuth,
    useStravaData,
    useStoryPreferences,
    useDownload,
};

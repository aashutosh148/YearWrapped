const isDevelopment = import.meta.env.MODE === 'development';

const logger = {
    info: (message, ...args) => {
        if (isDevelopment) {    
            console.log(`[INFO] ${message}`, ...args);
        }
    },

    warn: (message, ...args) => {
        console.warn(`[WARN] ${message}`, ...args);
    },

    error: (message, error = null, ...args) => {
        console.error(`[ERROR] ${message}`, error, ...args);
    },

    debug: (message, ...args) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    },

    apiRequest: (method, url, data = null) => {
        if (isDevelopment) {
            console.log(`[API] ${method} ${url}`, data);
        }
    },

    apiResponse: (method, url, status, data = null) => {
        if (isDevelopment) {
            const level = status >= 400 ? 'error' : 'info';
            console[level](`[API] ${method} ${url} - ${status}`, data);
        }
    },
};

export default logger;

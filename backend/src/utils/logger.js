const isDevelopment = process.env.NODE_ENV !== 'production';

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    green: '\x1b[32m',
    gray: '\x1b[90m',
};

const formatMessage = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level}] ${message} ${metaStr}`;
};

const logger = {
    info: (message, meta = {}) => {
        const formatted = formatMessage('INFO', message, meta);
        if (isDevelopment) {
            console.log(`${colors.blue}${formatted}${colors.reset}`);
        } else {
            console.log(formatted);
        }
    },

    warn: (message, meta = {}) => {
        const formatted = formatMessage('WARN', message, meta);
        if (isDevelopment) {
            console.warn(`${colors.yellow}${formatted}${colors.reset}`);
        } else {
            console.warn(formatted);
        }
    },

    error: (message, error = null, meta = {}) => {
        const errorMeta = error ? {
            ...meta,
            error: error.message,
            stack: isDevelopment ? error.stack : undefined,
        } : meta;

        const formatted = formatMessage('ERROR', message, errorMeta);
        if (isDevelopment) {
            console.error(`${colors.red}${formatted}${colors.reset}`);
        } else {
            console.error(formatted);
        }
    },

    debug: (message, meta = {}) => {
        if (isDevelopment) {
            const formatted = formatMessage('DEBUG', message, meta);
            console.log(`${colors.gray}${formatted}${colors.reset}`);
        }
    },

    success: (message, meta = {}) => {
        const formatted = formatMessage('SUCCESS', message, meta);
        if (isDevelopment) {
            console.log(`${colors.green}${formatted}${colors.reset}`);
        } else {
            console.log(formatted);
        }
    },

    // Request logging middleware
    requestLogger: (req, res, next) => {
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            const { method, originalUrl, ip } = req;
            const { statusCode } = res;

            const level = statusCode >= 400 ? 'warn' : 'info';
            logger[level](`${method} ${originalUrl}`, {
                statusCode,
                duration: `${duration}ms`,
                ip,
                userAgent: req.get('user-agent'),
            });
        });

        next();
    },
};

module.exports = logger;

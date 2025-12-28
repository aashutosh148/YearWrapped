const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Log the error with context
    logger.error('Request error', err, {
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.stravaId,
        body: req.body,
    });

    // Default error response
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    // In production, don't leak error details
    const isDevelopment = process.env.NODE_ENV !== 'production';

    res.status(statusCode).json({
        success: false,
        message,
        ...(isDevelopment && { stack: err.stack }),
    });
};

module.exports = errorHandler;

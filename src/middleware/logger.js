import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
    logger.info({
        type: 'request',
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
    });

    // Capture response
    const originalSend = res.send;
    res.send = function (data) {
        // Log response
        logger.info({
            type: 'response',
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            body: data
        });
        
        // Call original send
        return originalSend.apply(res, arguments);
    };

    next();
};

export default requestLogger; 
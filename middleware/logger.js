// Serverless-friendly logger setup
// No file system operations in serverless environments

// Logger function
const logger = {
  info: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'INFO',
      message,
      ...meta
    };
    console.log(JSON.stringify(logEntry));
  },
  error: (message, error = null, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'ERROR',
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null,
      ...meta
    };
    console.error(JSON.stringify(logEntry));
  }
};

// Middleware to attach logger to request object
const loggerMiddleware = (req, res, next) => {
  req.logger = logger;

  const startTime = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Response sent', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

module.exports = { logger, loggerMiddleware };
const { passport } = require('../services/passport');
const { redisClient } = require('../services/redis');

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    description: err.message || 'Internal server error',
    hint: err.hint || 'Please contact the administrator',
    metadata: {
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.originalUrl,
        payload: req.body
      }
    },
    error: {
      info: err.info || null,
      stack: err.stack,
    }
  });
};
const notFoundHandler = (req, res) => {
  res.status(404).send({
    error: 'Not found',
    alert: 'The requested resource was not found'
  });
};

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token === 'null') {
      const error = new CustomError({ 
        message: 'No token found in the authorization header', 
        hint: 'Please login again', 
        statusCode: 401,
        info
      });
  
      return next(error);
    }

    const isRevoked = await redisClient.get(token);

    if (isRevoked === 'revoked') {
      return res.status(401).send({
        description: 'Token has been revoked',
        hint: 'Please login again',
        metadata: {
          timestamp: new Date().toISOString(),
          request: {
            method: req.method,
            url: req.originalUrl,
            payload: req.body
          }
        },
      });
    }

    if (err || !user) {
      return res.status(401).send({
        description: 'Invalid token',
        hint: 'Please login again',
        metadata: {
          timestamp: new Date().toISOString(),
          request: {
            method: req.method,
            url: req.originalUrl,
            payload: req.body
          }
        },
      });
    }

    req.user = user;
    next();
  })(req, res, next);
}

module.exports = { errorHandler, notFoundHandler, ensureAuthenticated };

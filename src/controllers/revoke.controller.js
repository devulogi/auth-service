const { redisClient } = require('../services/redis');

exports.revokeController = async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1] 
    ? req.headers['authorization'].split(' ')[1] 
    : null;

  if (!token || token === 'null') {
    return res.status(401).send({
      description: 'No token found in the authorization header',
      hint: 'Please login again',
      metadata: {
        timestamp: new Date().toISOString(),
        request: {
          method: req.method,
          url: req.originalUrl,
          payload: req.body
        }
      }
    });
  }

  redisClient.set(token, 'revoked');

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send({
      description: 'No refresh token found in the cookie header',
      hint: 'Please login again',
      metadata: {
        timestamp: new Date().toISOString(),
        request: {
          method: req.method,
          url: req.originalUrl,
          payload: req.body
        }
      }
    });
  }

  redisClient.set(refreshToken, 'revoked');

  res.status(200).send({
    description: 'Token has been revoked',
    metadata: {
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.originalUrl,
        payload: req.body
      }
    }
  });
}

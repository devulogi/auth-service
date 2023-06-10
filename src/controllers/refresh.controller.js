const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { redisClient } = require('../services/redis');
const { CustomError } = require('../helpers');

exports.refreshController = async (req, res, next) => {
  // Check if refresh token exists in the cookie header
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const error = new CustomError({
      message: 'No refresh token found in the cookie header',
      hint: 'Please login again',
      statusCode: 401,
    });

    return next(error);
  }

  // Check if refresh token exists in Redis
  const cachedToken = await redisClient.get(refreshToken);

  if (!cachedToken || cachedToken === 'revoked') {
    const error = new CustomError({
      description:
        cachedToken === 'revoked'
          ? 'Token has been revoked'
          : 'Refresh token not found in the Redis database',
      hint: 'Please login again',
      statusCode: 403,
    });

    return next(error);
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send({
        description: 'Invalid refresh token',
        hint: 'Please login again',
        metadata: {
          timestamp: new Date().toISOString(),
          request: {
            method: req.method,
            url: req.originalUrl,
            payload: req.body,
          },
        },
      });
    }

    await redisClient.del(refreshToken);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30s',
    });
    res.send({ token });
  });
};

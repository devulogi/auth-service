const { redisClient } = require('../services/redis');

exports.logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Retrieve refresh token from the cookie

  if (refreshToken) {
    redisClient.del(refreshToken);
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  res.status(204).send();
}

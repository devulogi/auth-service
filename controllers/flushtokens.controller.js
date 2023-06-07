const { redisClient } = require('../services/redis');

exports.flushTokensController = async (req, res) => {
  redisClient.flushDb();
  res.status(204).send();
}

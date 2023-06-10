const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { CustomError } = require('../helpers');
const { redisClient } = require('../services/redis');
const { User } = require('../models/user.model');

exports.loginController = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET);
    
    // Store refresh token in Redis
    redisClient.set(refreshToken, user._id.toString(), 'EX', 60 * 60 * 1); // 1 hour expiration (seconds, minutes, hours)

    // Set refresh token as a cookie in the response header
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.send({ token });
  } else {
    const error = new CustomError({
      message: 'Invalid email or password',
      hint: 'Please try again',
      statusCode: 401
    });

    return next(error);
  }
}

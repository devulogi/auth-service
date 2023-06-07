const bcrypt = require('bcrypt');

const { User } = require('../models/user.model');

exports.registerController = async (req, res, next) => {
  const isEmailTaken = await User.exists({ email: req.body.email });
  if (isEmailTaken) {
    return res.status(400).send({
      description: 'Email already taken',
      hint: 'Please use a different email address',
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
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role
  });
  await user.save();
  res.status(201).send();
}

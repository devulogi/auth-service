const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const { refreshController } = require('../controllers/refresh.controller');
const { registerController } = require('../controllers/register.controller');
const { loginController } = require('../controllers/login.controller');
const { revokeController } = require('../controllers/revoke.controller');
const { logoutController } = require('../controllers/logout.controller');
const { flushTokensController } = require('../controllers/flushtokens.controller');
const { ensureAuthenticated, CustomError } = require('../helpers');

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/revoke', ensureAuthenticated, revokeController);
router.post('/logout', logoutController);
router.post('/flush-tokens', flushTokensController);

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.send({
    message: 'Welcome to the protected route',
    description: 'This is a protected route. You can only access this if you are logged in.',
    data: req.user,
    metadata: {
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.originalUrl
      }
    }
  });
});

module.exports = router;

const express = require('express');
const { validateSchema } = require('../middlewares/validateSchema');
const { isJWTAutenticated } = require('../middlewares/passport');
const accountController = require('../controllers/AccountController');

const router = express.Router();

router.post('/accounts/login',
  validateSchema(accountController.loginValidations),
  accountController.login);

router.post('/accounts/register',
  validateSchema(accountController.registerValidations),
  accountController.register);

router.post('/accounts/refresh',
  validateSchema(accountController.refreshAccessTokenValidations),
  accountController.refreshAccessToken);

router.get('/accounts', isJWTAutenticated, accountController.getAccount);

module.exports = router;

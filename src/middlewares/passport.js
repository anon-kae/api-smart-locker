const logger = require('../utils/logger')('passport');
const passport = require('passport');
const httpContext = require('express-http-context');
const { AccountService } = require('../services');
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require('passport-jwt');
const repositories = require('../repositories');
const config = require('../configs');
const { ROLE } = require('../utils/constants/account');

const extractJWT = ExtractJWT.fromAuthHeaderAsBearerToken();
const optionStrategyWithJWT = {
  jwtFromRequest: extractJWT,
  secretOrKey: config.jwt.secret,
  passReqToCallback: true,
};

/**
 * Authenticate with JWT
 * @param {object} req
 * @param {string} jwtPayload
 * @param {Function} done
 * @returns {Promise<*>}
 */
async function authenticateWithJWT(req, jwtPayload, done) {
  const { id: accountId, type, app } = jwtPayload;
  if (type !== 'access') {
    return done(null, false, { message: 'Invalid access token' });
  }

  try {
    let account = null;

    const accountService = new AccountService(repositories);
    const response = await accountService.findAccountById(accountId);

    account = response;

    if (!account) {
      logger.error(`Failed to JWT Login for account id=${account}, not found`, { account });
      return done(null, false, { message: 'Invalid user' });
    }

    logger.info(`Successfully JWT Login for account id=${accountId}`, { accountId });

    httpContext.set('accountId', accountId);
    req.jwt = { type, app };

    return done(null, account);
  } catch (error) {
    logger.error(error, { accountId });
    /* error is server fault (HTTP 500) */
    return done(error, false, { msg: error.message });
  }
}

/**
 * Authenticated by JWT
 */
passport.use(new JWTStrategy(optionStrategyWithJWT, authenticateWithJWT));

exports.isJWTAutenticated = passport.authenticate('jwt', { session: false });

exports.isAdmin = async (req, res, next) => {
  if (!req.account) {
    return res.status(401).json({ error: { message: 'Unauthenticated' } });
  }

  const hasRole = req.user.role;
  if (!hasRole && hasRole !== ROLE.admin) {
    return res.status(403).json({ error: { message: 'Permission Denied' } });
  }

  next();
};

exports.isUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: { message: 'Unauthenticated' } });
  }

  const hasRole = req.user.role;
  if (!hasRole && hasRole !== ROLE.user) {
    return res.status(403).json({ error: { message: 'Permission Denied' } });
  }

  next();
};

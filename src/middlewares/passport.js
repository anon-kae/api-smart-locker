const passport = require('passport');
const httpContext = require('express-http-context');
const { AccountService } = require('../services');
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require('passport-jwt');
const models = require('../models');
const logger = require('../utils/logger')('passport');
const config = require('../configs');

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
  const { id: accountId } = jwtPayload;
  try {
    let account = null;

    try {
      const accountService = new AccountService(models);
      const response = await accountService.findAccountById(accountId);

      account = response.data.data;
    } catch (error) {
      logger.error(`Error: JWT Login accountId=${accountId}, not found`, { accountId });
      return done(null, false, { message: 'Invalid user' });
    }

    /* return user */
    logger.info(`Success: JWT Login accountId=${accountId}`, { accountId });
    const { id } = account;

    httpContext.set('accountId', id);
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


const logger = require('../utils/logger')('AccountService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const dayjs = require('dayjs');

const { ResourceNotFoundError, UnauthorizedError } = require('../errors');
const { DEFAULT_ACCESS_TOKEN_LIFETIME, DEFAULT_REFRESH_TOKEN_LIFETIME } = require('../utils/constants/account');

/**
 * AccountService
 */
class AccountService {
  /**
   * Constructor
   * @param {object} repositories
   */
  constructor({ AccountRepository }) {
    this.AccountRepository = AccountRepository;
  }

  /**
   * Check password
   * @param {string} password
   * @param {string} passwordHash
   * @returns {Promise<*>}
   */
  _validPassword(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
  }

  /**
   * Generating a hash
   * @param {string}  password
   * @returns {Promise<*>}
   */
  _generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }

  /**
   * Generate Access Token
   * @param {string} accountId
   * @param {string} app
   * @param {string} exp
   * @return {*}
   */
  _generateAccessToken(accountId, app, exp) {
    const token = jwt.sign({ id: accountId, app, type: 'access', exp }, process.env.JWT_SECRET);

    logger.debug(`Successfully generated access token for account id=${accountId} on ${app} with exp=${exp}`, { accountId, app, exp });

    return token;
  }

  /**
   * Generate Refresh Token
   * @param {string} accountId
   * @param {string} app
   * @param {string} exp
   * @return {*}
   */
  _generateRefreshToken(accountId, app, exp) {
    const token = jwt.sign({ id: accountId, app, type: 'refresh', exp }, process.env.JWT_SECRET);

    logger.debug(`Successfully generated refresh token for account id=${accountId} on ${app} with exp=${exp}`, { accountId, app, exp });

    return token;
  }

  /**
   * Find account by accountId
   * @param {number} accountId
   * @param {Transaction} transaction;
   * @returns {Promise<*>}
   */
  async findAccountById(accountId, transaction = null) {
    const account = await this.AccountRepository.findById(accountId, transaction);

    if (!account) {
      logger.error(`Failed to find account id=${accountId}: not found`, { id: accountId });
      throw new ResourceNotFoundError('Account not found!');
    }

    logger.debug(`Successfully find account id=${accountId}`, { id: accountId, email: account.email });

    return account;
  }

  /**
   * Find account by Email
   * @param {string} email
   * @param {Transaction} transaction;
   * @returns {Promise<*>}
   */
  async findAccountByEmail(email, transaction = null) {
    const account = await this.AccountRepository.findByEmail(email, transaction);

    if (!account) {
      logger.error(`Failed to find account email=${email}: not found`, { id: account.id, email });
      throw new ResourceNotFoundError('Account not found!');
    }

    logger.debug(`Successfully find account email=${email}`, { id: account.id, email });

    return account;
  }

  /**
   * Login by email and password
   * @param {{ email: string, password: string }} account
   * @param {Transaction} transaction (optional)
   * @returns {Promise<*>}
   */
  async loginByEmailAndPassword({ email, password }, transaction = null) {
    const account = await this.AccountRepository.findPasswordByEmail(email, transaction);

    if (!account) {
      logger.error(`Failed to find account email=${email}: not found`, { email });
      throw new ResourceNotFoundError('Account not found!');
    }

    const isValidPassword = this._validPassword(password, account.password);

    if (!isValidPassword) {
      logger.error(`Failed to check password of account email=${email}`, { email });
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (account.password) {
      delete account.password;
    }

    return account;
  }

  /**
   * Create a new account
   * @param {{ firstName: string, lastName: string, email: string, password: string }} account
   * @param {Transaction} transaction (optional)
   * @returns {Promise<*>}
   */
  async createNewAccount({ firstName, lastName, email, password }, transaction = null) {
    const account = { firstName, lastName, email, password: this._generateHash(password) };

    await this.AccountRepository.createAccount(account, transaction);

    logger.debug(`Successfully created new account of email=${email}`, { firstName, lastName, email });

    return true;
  }

  /**
   * Create a new Token
   * @param {number} accountId
   * @param {string} application
   * @param {{ accessTokenExpiresIn: string, refreshTokenExpiresIn: string }} token
   * @param {Transaction} transaction (optional)
   * @return {Promise<{accessToken: *, refreshToken: *}>}
   */
  async createAuthToken(accountId, application, {
    accessTokenExpiresIn = DEFAULT_ACCESS_TOKEN_LIFETIME,
    refreshTokenExpiresIn = DEFAULT_REFRESH_TOKEN_LIFETIME
  } = {}, transaction = null) {
    // current time in epoch ms
    const currentTimestamp = dayjs();

    // get milliseconds from *ExpiresIn (always string, so ms return number), then add to current time
    const accessTokenExpires = currentTimestamp.add(ms(accessTokenExpiresIn.toString()), 'ms');
    const refreshTokenExpires = currentTimestamp.add(ms(refreshTokenExpiresIn.toString()), 'ms');

    // sign tokens
    const accessToken = this._generateAccessToken(accountId, application, accessTokenExpires.unix());
    const refreshToken = this._generateRefreshToken(accountId, application, refreshTokenExpires.unix());

    await this.AccountRepository.createAuthToken({
      accountId,
      application,
      accessToken,
      accessTokenExpires: accessTokenExpires.toDate(),
      refreshToken,
      refreshTokenExpires: refreshTokenExpires.toDate(),
    }, transaction);

    logger.debug(`Successfully created new auth token for account id=${accountId}, expires in ${accessTokenExpiresIn}/${refreshTokenExpiresIn}`, {
      accountId, accessTokenExpiresIn, refreshTokenExpiresIn
    });

    return { accessToken, refreshToken };
  }

  /**
   * Find Auth Token by Refresh Token
   * @param {string} refreshToken
   * @param {Transaction} transaction
   * @return {Promise<null|AuthToken>}
   */
  async findAuthTokenByRefreshToken(refreshToken, transaction = null) {
    const authToken = await this.AccountRepository.findByRefreshToken(refreshToken, transaction);

    if (!authToken) {
      logger.warning('Failed to find auth token using refresh token');
      return null;
    }

    const { accountId } = authToken;
    logger.debug(`Successfully find auth token using refresh token for account id=${accountId}`, { accountId });

    return authToken;
  }

  /**
   * Refresh Access Token
   * @param {number} authTokenId
   * @param {string} accessTokenExpiresIn
   * @param {Transaction} transaction
   * @return {Promise<*>}
   */
  async refreshAccessToken(authTokenId, { accessTokenExpiresIn = DEFAULT_ACCESS_TOKEN_LIFETIME } = {}, transaction = null) {
    const { accountId, application } = await this.AccountRepository.findByAuthTokenId(authTokenId, transaction);

    // get milliseconds from *ExpiresIn (always string, so ms return number), then add to current time
    const accessTokenExpires = dayjs().add(ms(accessTokenExpiresIn.toString()), 'ms');

    // sign token
    const accessToken = this._generateAccessToken(accountId, application, accessTokenExpires.unix());

    await this.AccountRepository.updateAccessToken(authTokenId, {
      accessToken, accessTokenExpires: accessTokenExpires.toDate()
    }, transaction);

    logger.debug(`Successfully refresh access token for auth token id=${authTokenId} and account id=${accountId} on ${application}`, {
      authTokenId, accountId, application
    });

    return accessToken;
  }

  /**
   * Revoke All Auth Token by accountId
   * @param {string} accountId
   * @param {Transaction} transaction
   * @return {Promise<Number>}
   */
  async revokeAllAuthTokenByAccountId(accountId, transaction = null) {
    const deletedCount = await this.AccountRepository.removeAllByAccountId(accountId, transaction);

    if (deletedCount <= 0) {
      logger.warning(`Failed to remove all auth token of account id=${accountId}: not found`, { accountId });
      return 0;
    }

    logger.debug(`Successfully removed all ${deletedCount} auth token of account id=${accountId}`, { accountId });

    return deletedCount;
  }
}

module.exports = AccountService;

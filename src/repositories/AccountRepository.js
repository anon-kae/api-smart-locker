const { Account, AuthToken } = require('../models');

/**
 * Account Repository
 */
class AccountRepository {
  /**
   * Find account by accountId
   * @param {string}        accountId
   * @param {Transaction}   transaction (optional)
   * @return {Promise<*>}
   */
  static async findById(accountId, transaction = null) {
    const account = await Account.findOne({ where: { id: accountId, status: 'ACTIVE' }, transaction });
    return account.toJSON();
  }

  /**
   * Find account by email
   * @param {string}        email
   * @param {Transaction}   transaction (optional)
   * @return {Promise<*>}
   */
  static async findPasswordByEmail(email, transaction = null) {
    const account = await Account.scope('withPassword').findOne({ where: { email, status: 'ACTIVE' }, transaction });
    return account.toJSON();
  }

  /**
   * Find account by email
   * @param {string}        email
   * @param {Transaction}   transaction (optional)
   * @return {Promise<*>}
   */
  static async findByEmail(email, transaction = null) {
    const account = await Account.findOne({ where: { email, status: 'ACTIVE' }, transaction });
    return account.toJSON();
  }

  /**
   * Create a new auth token
   * @param {{ accountId: number, application: string, accessToken: string, accessTokenExpires: Date, refreshToken: string, refreshTokenExpires: Date }} token
   * @param {Transaction} transaction (optional)
   * @return {Promise<AuthToken>}
   */
  static async createAuthToken({ accountId, application, accessToken, accessTokenExpires, refreshToken, refreshTokenExpires }, transaction = null) {
    return AuthToken.create({
      accountId,
      application,
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    }, { transaction, raw: true });
  }

  /**
   * Find auth token by Refresh Token
   * @param {string} refreshToken
   * @param {Transaction} transaction (optional)
   * @return {Promise<AuthToken | null>}
   */
  static async findByRefreshToken(refreshToken, transaction = null) {
    return AuthToken.findOne({
      where: { refreshToken },
      raw: true,
      transaction
    });
  }

  /**
   * Find auth token by ID
   * @param {number} authTokenId
   * @param {Transaction} transaction (optional)
   * @return {Promise<AuthToken | null>}
   */
  static async findByAuthTokenId(authTokenId, transaction = null) {
    return AuthToken.findByPk(authTokenId, { raw: true, transaction });
  }

  /**
   * Update access token
   * @param {number} authTokenId
   * @param {{accessToken: string, accessTokenExpires: Date}} token
   * @param {Transaction} transaction (optional)
   * @return {Promise<[number, AuthToken[]]>}
   */
  static async updateAccessToken(authTokenId, { accessToken, accessTokenExpires }, transaction = null) {
    return AuthToken.update({ accessToken, accessTokenExpires }, {
      where: { id: authTokenId },
      transaction,
      returning: true,
      raw: true,
    });
  }

  /**
   * Create a new account
   * @param {{ firstName: string, lastName: string, email: string, password: string }} account
   * @param {Transaction} transaction (optional)
   * @return {Promise<AuthToken>}
   */
  static async createAccount({ firstName, lastName, email, password }, transaction = null) {
    return Account.create({ firstName, lastName, email, password, status: 'ACTIVE' }, { transaction, raw: true });
  }

  /**
   * Remove ALL auth token by accountId
   * @param {string} accountId
   * @param {Transaction} transaction (optional)
   * @return {Promise<number>}
   */
  static async removeAllByAccountId(accountId, transaction = null) {
    return AuthToken.destroy({ where: { accountId }, transaction });
  }
}

module.exports = AccountRepository;

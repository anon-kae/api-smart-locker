const joi = require('joi');
const logger = require('../../utils/logger')('LoginWithEmailAndPasswordUseCase');
const { DEFAULT_ACCESS_TOKEN_LIFETIME, DEFAULT_REFRESH_TOKEN_LIFETIME } = require('../../utils/constants/account');

/**
 * LoginWithEmailAndPasswordUseCase
 */
class LoginWithEmailAndPasswordUseCase {
  /**
   * Constructor
   * @param {AccountService} AccountService
   * @param {Repositories} repositories
   */
  constructor({ AccountService }, repositories) {
    this.AccountService = AccountService;
    this.repositories = repositories;
  }

  /**
   * validators
   */
  static getValidators = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
  });

  /**
   * Execute UseCase
   */
  async execute(email, password) {
    const accountService = new this.AccountService(this.repositories);

    // check email and password
    const account = await accountService.loginByEmailAndPassword({ email, password });
    const { id: accountId } = account;

    // revoke all existing logins
    await accountService.revokeAllAuthTokenByAccountId(accountId);

    const tokenConfig = { accessTokenExpiresIn: DEFAULT_ACCESS_TOKEN_LIFETIME, refreshTokenExpiresIn: DEFAULT_REFRESH_TOKEN_LIFETIME };

    // then create a new one
    const { accessToken, refreshToken } = await accountService.createAuthToken(accountId, 'MOBILE_ROOT_USER', tokenConfig);

    logger.info(`Successfully login account id=${accountId}`, { accountId, email });

    return {
      account,
      accessToken,
      refreshToken,
    };
  }
}

module.exports = LoginWithEmailAndPasswordUseCase;

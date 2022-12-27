const joi = require('joi');
const dayjs = require('dayjs');
const { PermissionError } = require('../../errors');
const logger = require('../../utils/logger')('RefreshAccessTokenUseCase');
const { sequelize } = require('../../models');
const { DEFAULT_ACCESS_TOKEN_LIFETIME } = require('../../utils/constants/account');

/**
 * RefreshAccessTokenUseCase
 */
class RefreshAccessTokenUseCase {
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
    accessToken: joi.string().required(),
    refreshToken: joi.string().required()
  });

  /**
   * Execute UseCase
   */
  async execute(accessToken, refreshToken) {
    const accountService = new this.AccountService(this.repositories);

    return sequelize.transaction(async (transaction) => {
      const authToken = await accountService.findAuthTokenByRefreshToken(refreshToken, transaction);

      const { id: authTokenId, application, accountId, accessToken: currentAccessToken, refreshTokenExpires } = authToken;

      // throw if refresh token expired
      if (dayjs(refreshTokenExpires).isBefore(dayjs())) {
        throw new PermissionError('Invalid Token');
      }

      // throw if mismatch current access token
      if (currentAccessToken !== accessToken) {
        throw new PermissionError('Invalid Token');
      }

      const configAccessToken = { accessTokenExpiresIn: DEFAULT_ACCESS_TOKEN_LIFETIME };

      // generate new access token
      const newAccessToken = await accountService.refreshAccessToken(authTokenId, configAccessToken, transaction);

      logger.info(`Successfully refresh ${application} access token for account id=${accountId}`, { application, accountId });

      return { accessToken: newAccessToken };
    });
  }
}

module.exports = RefreshAccessTokenUseCase;

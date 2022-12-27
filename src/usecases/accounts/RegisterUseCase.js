const joi = require('joi');
const logger = require('../../utils/logger')('RegisterUseCase');
const { sequelize } = require('../../models');

/**
 * RegisterUseCase
 */
class RegisterUseCase {
  /**
   * Constructor
   * @param {AccountService} AccountService
   * @param {Repositories}   repositories
   */
  constructor({ AccountService }, repositories) {
    this.AccountService = AccountService;
    this.repositories = repositories;
  }

  /**
   * validators
   */
  static getValidators = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
  });

  /**
   * Execute
   */
  async execute({ firstName, lastName, email, password }) {
    const accountService = new this.AccountService(this.repositories);

    return sequelize.transaction(async (transaction) => {
      const isCreatedAccount = await accountService.createNewAccount({ firstName, lastName, email, password }, transaction);

      logger.info(`Successfully created account of email=${email}`, { email, firstName, lastName });

      return isCreatedAccount;
    });
  }
}

module.exports = RegisterUseCase;

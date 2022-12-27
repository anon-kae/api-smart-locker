const logger = require('../../utils/logger')('GetCurrentAccountUseCase');

/**
 * GetCurrentAccountUseCase
 */
class GetCurrentAccountUseCase {
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
   * Execute UseCase
   */
  async execute(account) {
    const accountService = new this.AccountService(this.repositories);

    const { id: accountId, email } = account;

    const accountInfo = await accountService.findAccountById(accountId);

    logger.info(`Successfully find account id=${accountId}`, { accountId, email });

    return accountInfo;
  }
}

module.exports = GetCurrentAccountUseCase;

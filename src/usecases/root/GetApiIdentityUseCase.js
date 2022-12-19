/**
 * Get API Identity UseCase
 */
class GetApiIdentityUseCase {
  /**
   * Get all validators
   */
  static getValidators() {
    return [];
  }

  /**
   * Execute UseCase
   */
  async execute() {
    return { message: 'SmartLocker API' };
  }
}

module.exports = GetApiIdentityUseCase;

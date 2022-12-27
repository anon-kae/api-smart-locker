module.exports = function AuthToken(Sequelize) {
  /**
   * model description
   */
  class AuthToken extends Sequelize.Model {
    /**
     * initialize
     * @param sequelize
     * @returns {*}
     */
    static initialize(sequelize) {
      this.sequelize = sequelize;
      const { DataTypes } = Sequelize;

      // table definition
      return this.init({
        accountId: { type: DataTypes.INTEGER, allowNull: false },
        application: { type: DataTypes.ENUM, allowNull: false, values: ['MOBILE_ROOT_USER', 'WEB_ADMIN'] },
        accessToken: { type: DataTypes.TEXT, allowNull: false },
        accessTokenExpires: { type: DataTypes.DATE, allowNull: false },
        refreshToken: { type: DataTypes.TEXT, allowNull: false },
        refreshTokenExpires: { type: DataTypes.DATE, allowNull: false },
      }, {
        indexes: [
          {
            fields: ['accountId']
          },
          {
            fields: ['application']
          },
          {
            fields: ['accessToken']
          },
          {
            fields: ['refreshToken']
          }
        ],
        sequelize,
        modelName: 'AuthToken',
      });
    }

    /**
     * association
     * @param models
     */
    static associate(models) {
      // save the models
      this.models = models;

      this.belongsTo(models.Account, {
        as: 'account',
        foreignKey: 'accountId',
      });
    }
  }

  return AuthToken;
};

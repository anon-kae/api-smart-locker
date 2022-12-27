module.exports = function Account(Sequelize) {
  /**
   * model description
   */
  class Account extends Sequelize.Model {
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
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: [1, 100] } },
        password: { type: DataTypes.STRING(60), allowNull: false },
        status: { type: DataTypes.ENUM, allowNull: false, values: ['ACTIVE', 'INACTIVE'], defaultValue: 'ACTIVE' },
        roleId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 }
      },
      {
        defaultScope: {
          attributes: {
            exclude: ['password'],
          },
        },
        scopes: {
          // specify that we want password (for updating password)
          withPassword: { attributes: {}, }, // get all attributes
        },
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['roleId'],
          },
        ],
        sequelize,
        modelName: 'Account',
      });
    }

    /**
     * association
     * @param models
     */
    static associate(models) {
      // save the models
      this.models = models;

      this.belongsTo(models.Role, {
        as: 'role',
        foreignKey: 'roleId',
      });
    }
  }

  return Account;
};

module.exports = function Role(Sequelize) {
  /**
   * model description
   */
  class Role extends Sequelize.Model {
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
        name: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM, allowNull: false, values: ['ACTIVE', 'INACTIVE'], defaultValue: 'ACTIVE' }
      },
      {
        indexes: [
          {
            fields: ['id'],
          },
        ],
        sequelize,
        modelName: 'Role',
      });
    }

    /**
     * association
     * @param models
     */
    static associate(models) {
      // save the models
      this.models = models;

      this.hasMany(models.Account, {
        foreignKey: 'roleId',
        as: 'roles',
        onDelete: 'cascade',
        hooks: true,
      });
    }
  }

  return Role;
};

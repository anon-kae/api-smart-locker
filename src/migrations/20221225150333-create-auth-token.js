module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('AuthTokens', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      application: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['MOBILE_ROOT_USER', 'WEB_ADMIN'],
        defaultValue: 'MOBILE_ROOT_USER'
      },
      accessToken: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      accessTokenExpires: {
        type: Sequelize.DATE,
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      refreshTokenExpires: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    }, { transaction });

    await queryInterface.addIndex('AuthTokens', ['accountId'], { fields: 'accountId', transaction });
    await queryInterface.addIndex('AuthTokens', ['application'], { fields: 'application', transaction });
    await queryInterface.addIndex('AuthTokens', ['accessToken'], { fields: 'accessToken', transaction });
    await queryInterface.addIndex('AuthTokens', ['refreshToken'], { fields: 'refreshToken', transaction });
  }),

  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('AuthTokens', ['accountId'], { transaction });
    await queryInterface.removeIndex('AuthTokens', ['application'], { transaction });
    await queryInterface.removeIndex('AuthTokens', ['accessToken'], { transaction });
    await queryInterface.removeIndex('AuthTokens', ['refreshToken'], { transaction });
    await queryInterface.dropTable('AuthTokens', { transaction });
  })
};

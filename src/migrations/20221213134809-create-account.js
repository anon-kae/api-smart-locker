module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [1, 100] }
      },
      password: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['ACTIVE', 'INACTIVE'],
        defaultValue: 'ACTIVE'
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
    }, { transaction: t });
  }),
  down: (queryInterface) => queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.dropTable('Accounts');
    await queryInterface.dropEnum('enum_Accounts_status', { transaction: t });
  })
};

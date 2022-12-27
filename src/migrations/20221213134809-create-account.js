module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
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
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    }, { transaction });

    await queryInterface.addIndex('Accounts', ['id'], { fields: 'id', transaction });
    await queryInterface.addIndex('Accounts', ['roleId'], { fields: 'roleId', transaction });
  }),
  down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('Accounts', ['id'], { transaction });
    await queryInterface.removeIndex('Accounts', ['roleId'], { transaction });
    await queryInterface.dropTable('Accounts');
    await queryInterface.dropEnum('enum_Accounts_status', { transaction });
  })
};

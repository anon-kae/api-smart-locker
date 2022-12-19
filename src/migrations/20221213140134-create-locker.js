module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.createTable('Lockers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Lockers');
    await queryInterface.dropEnum('enum_Lockers_status', { transaction: t });
  })
};

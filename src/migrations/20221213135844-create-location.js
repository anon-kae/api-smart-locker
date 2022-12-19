module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      locateName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Locations');
    await queryInterface.dropEnum('enum_Locations_status', { transaction: t });
  })
};

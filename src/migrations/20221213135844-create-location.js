module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
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
    }, { transaction });

    await queryInterface.addIndex('Locations', ['id'], { fields: 'id', transaction });
  }),
  down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('Locations', ['id'], { transaction });
    await queryInterface.dropTable('Locations');
    await queryInterface.dropEnum('enum_Locations_status', { transaction });
  })
};

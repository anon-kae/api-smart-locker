module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      passCodeIn: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { len: [1, 6] }
      },
      accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lockerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      passCodeOut: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { len: [1, 6] }
      },
      expirationDate: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('Bookings', ['id'], { fields: 'id', transaction });
    await queryInterface.addIndex('Bookings', ['accountId'], { fields: 'accountId', transaction });
    await queryInterface.addIndex('Bookings', ['lockerId'], { fields: 'lockerId', transaction });
  }),
  down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('Bookings', ['id'], { transaction });
    await queryInterface.removeIndex('Bookings', ['accountId'], { transaction });
    await queryInterface.removeIndex('Bookings', ['lockerId'], { transaction });
    await queryInterface.dropTable('Bookings');
    await queryInterface.dropEnum('enum_Bookings_status', { transaction });
  })
};

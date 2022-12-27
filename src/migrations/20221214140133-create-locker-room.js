module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('LockerRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false
      },
      column: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lockerId: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex('LockerRooms', ['id'], { fields: 'id', transaction });
    await queryInterface.addIndex('LockerRooms', ['lockerId'], { fields: 'lockerId', transaction });
  }),
  down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('LockerRooms', ['id'], { transaction });
    await queryInterface.removeIndex('LockerRooms', ['lockerId'], { transaction });
    await queryInterface.dropTable('LockerRooms');
    await queryInterface.dropEnum('enum_LockerRooms_status', { transaction });
  })
};

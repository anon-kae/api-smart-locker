module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (t) => {
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
    }, { transaction: t });
  }),
  down: (queryInterface) => queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.dropTable('Bookings');
    await queryInterface.dropEnum('enum_Bookings_status', { transaction: t });
  })
};

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [
    {
      id: 1,
      name: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {}),
};

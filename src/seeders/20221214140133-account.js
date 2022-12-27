const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Accounts', [{
    id: 1,
    firstName: 'SmartLocker',
    lastName: 'Admin',
    roleId: 1,
    email: 'admin@smartlocker.com',
    password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10), null),
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Accounts', null, {}),
};

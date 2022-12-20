const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const errors = {};
fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const errorClass = require(path.join(__dirname, file));
    errors[errorClass.name] = errorClass;
  });

module.exports = errors;

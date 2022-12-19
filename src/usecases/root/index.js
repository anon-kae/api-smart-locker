/* eslint-disable security/detect-non-literal-require */
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const usecases = {};
fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const UseCase = require(path.join(__dirname, file));
    usecases[UseCase.name] = UseCase;
  });

module.exports = usecases;

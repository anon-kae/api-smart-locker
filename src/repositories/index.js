/* eslint-disable security/detect-non-literal-require */
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');

const repositories = {};

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const repository = require(path.join(__dirname, file));
    repositories[repository.name] = repository;
  });

module.exports = repositories;

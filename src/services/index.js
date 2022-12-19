/* eslint-disable security/detect-non-literal-require */
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');
const services = {};

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const service = require(path.join(__dirname, file));
    services[service.name] = service;
  });

module.exports = services;

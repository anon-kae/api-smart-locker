const logger = require('../utils/logger')('migration');
const { databaseCredential } = require('.');
const { username, password, database, port, host, dialect, timezone } = databaseCredential;

module.exports = {
  development: { dialect, username, password, database, host, port, timezone, logging: logger.debug },
  staging: { dialect, username, password, database, host, port, timezone },
  production: { dialect, username, password, database, host, port, timezone },
};

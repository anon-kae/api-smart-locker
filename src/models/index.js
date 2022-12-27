/* eslint-disable security/detect-non-literal-require */
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const { env, logQuery } = require('../configs');
const config = require('../configs/database')[env];
const logger = require('../utils/logger')('database');

const db = {};

// Show database query only if LOG_DB_QUERY env is set to true
if (logQuery === 'true') {
  config.logging = (message) => logger.debug(message);
} else {
  config.logging = false;
}

// disable console SQL logging in production
if (env === 'production') {
  config.logging = false;
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize.authenticate().then(() => logger.debug(`✅ Connected to database '${config.database}' at ${config.host}:${config.port}`), () => logger.error('⚠ Cannot connect to database.'));

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const modelFactory = require(path.join(__dirname, file));
    const Model = modelFactory(Sequelize);
    Model.initialize(sequelize);
    db[Model.name] = Model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

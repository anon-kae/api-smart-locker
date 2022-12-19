const joi = require('joi');

const environmentSchema = {
  NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
  PORT: joi.number().default(8000),
  CORS_WHITELIST_ORIGINS: joi.string().required(),

  /* Database PG */
  DB_HOSTNAME: joi.string().required(),
  DB_PORT: joi.number().required().default(5432),
  DB_NAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_USERNAME: joi.string().required()
};

const validateEnvironmentSchema = joi.object().keys(environmentSchema).unknown();

const { value, error } = validateEnvironmentSchema.prefs({ errors: { label: 'key' } }).validate(process.env, { stripUnknown: true });

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const environment = value;

module.exports = {
  env: environment.NODE_ENV,
  port: environment.PORT,
  database: {
    databaseName: environment.DB_NAME,
    hostname: environment.DB_HOSTNAME,
    port: environment.DB_PORT,
    username: environment.DB_USERNAME,
    password: environment.DB_PASSWORD,
  }
};

const joi = require('joi');

const environmentSchema = {
  NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
  HOST: joi.string().required(),
  PORT: joi.number().default(8000),
  CORS_WHITELIST_ORIGINS: joi.string().required(),
  JWT_SECRET: joi.string().required(),

  /* Logging */
  LOG_LEVEL: joi.string().required(),
  LOG_DB_QUERY: joi.boolean().required(),
  LOG_STACKDRIVER_CREDENTIALS: joi.string().optional().allow(''),

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
  host: environment.HOST,
  port: environment.PORT,
  logLevel: environment.LOG_LEVEL,
  logQuery: environment.LOG_DB_QUERY,
  logStackDriverCredentials: environment.LOG_STACKDRIVER_CREDENTIALS,
  whitelistOrigins: environment.CORS_WHITELIST_ORIGINS,
  jwt: {
    secret: environment.JWT_SECRET
  },
  database: {
    databaseName: environment.DB_NAME,
    hostname: environment.DB_HOSTNAME,
    port: environment.DB_PORT,
    username: environment.DB_USERNAME,
    password: environment.DB_PASSWORD,
  }
};

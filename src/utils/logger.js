const colors = require('colors/safe');
const winston = require('winston');
const httpContext = require('express-http-context');
const { LoggingWinston: StackdriverLogging } = require('@google-cloud/logging-winston');
const config = require('../configs');

const LEVEL_INFO_ENV_ARRAY = ['production', 'staging'];
let projectName = 'unknown';

/**
 * Logger
 * @param label
 * @returns {{debug: (function(...[*]): void)
 *          , stream: {write: (function(...[*]): void)}
 *          , warning: (function(...[*]): void)
 *          , error: (function(...[*]): void)
 *          , info: (function(...[*]): void)}}
 * @constructor
 */
function Logger(label = null) {
  /* default level */
  let LOG_LEVEL = 'debug';

  /* set level info only for production and staging */
  if (config.env && LEVEL_INFO_ENV_ARRAY.includes(config.env.toLowerCase())) {
    LOG_LEVEL = 'info';
  }

  /* override LOG_LEVEL if explicitly specify */
  if (config.logLevel) {
    LOG_LEVEL = config.logLevel.toLowerCase();
  }

  /* set format */
  const defaultFormat = winston.format.combine(winston.format.label({ label }),
    winston.format.timestamp(),
    winston.format.simple());

  const jsonFormat = winston.format.combine(winston.format.label({ label }),
    winston.format.timestamp(),
    winston.format.uncolorize(),
    winston.format.json(),);

  const plainFormat = winston.format.combine(winston.format.label({ label }),
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf((msg) => {
      const requestId = msg.requestId || '<--- no request --->';
      const accountId = msg.accountId !== -1 ? msg.accountId : '---';

      /* handle error object */
      if (msg.stack) {
        return `${msg.timestamp} > 🆔 ${colors.gray(requestId)} | 👤 ${colors.yellow(accountId)} [${colors.brightBlue(msg.action)}] ${msg.level}: ${msg.stack}`;
      }

      /* handle error from logger */
      if (msg.error && msg.error.stack) {
        return `${msg.timestamp} > 🆔 ${colors.gray(requestId)} | 👤 ${colors.yellow(accountId)} [${colors.brightBlue(msg.action)}] ${msg.level}: ${msg.error.stack}`;
      }

      return `${msg.timestamp} > 🆔 ${colors.gray(requestId)} | 👤 ${colors.yellow(accountId)} [${colors.brightBlue(msg.action)}] ${msg.level}: ${msg.message}`;
    }),);

  /* set transports */
  const transports = [];

  let CONSOLE_LOG_LEVEL = LOG_LEVEL;

  if (config.env && LEVEL_INFO_ENV_ARRAY.includes(config.env.toLowerCase()) && config.logStackDriverCredentials) {
    transports.push(new StackdriverLogging({
      keyFilename: config.logStackDriverCredentials,
      serviceContext: {
        service: `${config.env.toLowerCase()}-${projectName}`,
        version: process.env.npm_package_version || 'unknown-version'
      },
      logName: `${config.env.toLowerCase()}-${projectName}`,
      resource: {
        type: 'global',
        labels: {},
      },
      labels: {
        action: label || 'Unknown'
      },
      levels: winston.config.syslog.levels,
      level: LOG_LEVEL,
      format: jsonFormat,
    }));

    CONSOLE_LOG_LEVEL = 'error';
  }

  transports.push(new winston.transports.Console({
    level: CONSOLE_LOG_LEVEL,
    json: true,
    format: plainFormat,
  }));

  const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: defaultFormat, // as default
    transports,
  });

  const getLocationName = (metadata) => {
    let action = label;
    const requestId = httpContext.get('requestId') || '<--- no request --->';
    const accountId = httpContext.get('accountId') || -1;

    /* If action is supplied in logger parameters, use it as action name; otherwise, use auto-generated action name */
    if (!action) {
      const stackTrace = new Error().stack.split('\n');
      const matches = stackTrace[4].match(/[/\\]([a-zA-Z0-9-_.]+)\.[jt]s/);

      [, action = 'Unknown'] = matches ?? [];
    }

    return {
      action,
      requestId,
      accountId,
      [action]: metadata
    };
  };

  const useLogger = (level, ...params) => {
    params[1] = getLocationName(params[1]);
    params[1].project = projectName;
    logger[level](...params);
  };

  return {
    debug: (...params) => useLogger('debug', ...params),
    info: (...params) => useLogger('info', ...params),
    warning: (...params) => useLogger('warning', ...params),
    error: (...params) => useLogger('error', ...params),
    stream: {
      write: (...params) => useLogger('info', ...params)
    }
  };
}

Logger.project = (name) => {
  projectName = name;
};

module.exports = Logger;

const Logger = require('./utils/logger');

/**
 * Setup logger
 */
Logger.project('api-smart-locker');
const logger = Logger('app');

const compression = require('compression');
const express = require('express');
const cors = require('cors');
const httpContext = require('express-http-context');

require('./models');
process.setMaxListeners(0);

const rootRoutes = require('./routes/root');
const routes = require('./routes');
const helmet = require('helmet');
const config = require('./configs');
const morgan = require('morgan');
const generateRequestID = require('./utils/requestIdGenerator');
const errorHandler = require('./utils/errorHandler');

const { WHITELIST_ORIGINS } = require('./utils/constants/global');

/**
 * Generate Express App
 */
function generateExpressApp() {
  const app = express();

  // first, log request
  app.use(morgan(':method :url ▶ :status 💻 :user-agent (⌚ :response-time ms)', { stream: Logger('http').stream }));

  app.use(httpContext.middleware);
  app.use((req, res, next) => {
    httpContext.set('requestId', generateRequestID());
    next();
  });

  app.use('/static', express.static('./public'));

  // set security HTTP headers
  app.use(helmet());

  // parse json request body
  app.use(express.json({ limit: '100mb' }));

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // gzip compression
  app.use(compression());

  // set security cors
  app.use(cors({
    origin: WHITELIST_ORIGINS,
    credentials: true,
  }));

  // root routes
  app.use('/api', rootRoutes);

  // v1 api routes
  app.use('/api/v1', routes);

  // handle error
  app.use(errorHandler);

  return app;
}

/**
 * Start Local Express Server
 */
function startLocalServer() {
  const app = generateExpressApp();
  const ENV = config.env || 'development';
  const HOST = config.host || '0.0.0.0';
  const PORT = config.port ? Number(config.port) : 8080;

  app.listen(PORT, HOST, () => {
    logger.debug(`App is running at http://${HOST}:${PORT}/ in ${ENV} mode`, { HOST, PORT, ENV });
  });

  return app;
}

const API = startLocalServer();

module.exports = { API };

const config = require('../../configs');

exports.WHITELIST_ORIGINS = (config.whitelistOrigins ?? '').split(',');

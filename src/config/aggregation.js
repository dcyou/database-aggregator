'use strict';

'use strict';

const find = require('find');
const path = require('path');
const debug = require('../util/debug')('config:aggregation');

module.exports = {aggregation: {}};
const dbConfig = module.exports.aggregation;
const homeDir = require('./home').homeDir;
if (!homeDir) {
    return;
}

const aggregationDir = path.join(homeDir, 'aggregation');
var databases;
try {

    debug.trace('Searching aggregation configurations in ' + aggregationDir);
    databases = find.fileSync(/\.js$/, aggregationDir);
} catch (e) {
    debug.debug('No aggregation directory found');
}
databases = databases || [];

for (const database of databases) {
    let databaseConfig;
    let configPath = path.resolve(aggregationDir, database);
    let parsedConfigPath = path.parse(configPath);
    if (parsedConfigPath.ext !== '.js') {
        continue;
    }

    databaseConfig = require(configPath);
    if (!databaseConfig.sources || databaseConfig.disabled === true) {
        continue;
    }
    dbConfig[parsedConfigPath.name] = databaseConfig;
}


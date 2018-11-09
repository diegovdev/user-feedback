const config   = require('./config');
const dbConfig = config.get('database');

module.exports = dbConfig;
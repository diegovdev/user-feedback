const nconf      = require('nconf');
const fs         = require('fs');

//--define default values-----------------------------------------------------------------------------------------------
var defaults   = {
    environment: 'sandbox',                                               //values: sandbox | production
    logLevel: 'info',                                                     //values: silly:0 < debug:1 < verbose:2 < info:3 < warn:4 < error:5
    app: {
        name: 'ubisoft-user-feedback',
        port: '3300',                                                     //http port
        validationMode: process.env.VALIDATION_MODE || 'permissive',      //values: strict | permissive
        datastore: process.env.DATASTORE || 'mysql',                      //values: memory | mysql
    },
    database: {
        username: 'root',
        password: 'password',
        database: 'feedbackdb',
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }
};


//--Setup nconf to use (in-order)---------------------------------------------------------------------------------------
// 1. config file
// 2. command-line arguments
// 3. default values
var currentEnv = process.env.ENVIRONMENT || 'sandbox';
var configFile = __dirname+'/config-' + currentEnv + '.json';
nconf.file({ file: configFile })
     .argv()
     .defaults(defaults);


//--create json config file with defaults if it doesn't exist-----------------------------------------------------------
if (!fs.existsSync(configFile)) {
    var fd = fs.openSync(configFile, 'w');
    fs.writeSync(fd, JSON.stringify(nconf.get(), null, 4));
    fs.closeSync(fd);
}


module.exports = nconf;

console.log('------------------------------------------------');
console.log('app-name: %s', nconf.get('app:name'));
console.log('environment: %s', currentEnv);
console.log('logLevel: %s', nconf.get('logLevel'));
console.log('datastore: %s', nconf.get('app:datastore'));
console.log('validationMode: %s', nconf.get('app:validationMode'));
console.log('------------------------------------------------');


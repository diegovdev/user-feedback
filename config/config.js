//--loading external libraries------------------------------------------------------------------------------------------
var nconf      = require('nconf');
var fs         = require('fs');

//--define default values-----------------------------------------------------------------------------------------------
var defaults   = {
    'environment': 'sandbox',                                               //values: sandbox | production
    'app': {
        'name': 'user-feedback',
        'port': '3300',                                                     //http port
    },
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

console.log('environment: %s', currentEnv);


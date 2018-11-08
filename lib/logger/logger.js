//--loading external libraries------------------------------------------------------------------------------------------
var config          = require('../../config/config');
var fs              = require('fs');
var path            = require('path');
var util            = require('util');
var winston         = require('winston');

//--local variables-----------------------------------------------------------------------------------------------------
var environment     = config.get('environment');
var logDirectory    = path.join(__dirname,'/../../logs');
var defaultLogFile  = path.join(__dirname,'/../../logs/'+environment+'.log');

if (!fs.existsSync(logDirectory)) {
    console.log('mkdir', logDirectory);
    fs.mkdirSync(logDirectory);
}

const myFormat = winston.format.printf(function(data) {
    if (Array.isArray(data.meta))
        data.meta = util.format.apply(util, data.meta);
    return `${data.timestamp} ${data.level}: ${data.message}: ${data.meta}.`;
});

const myCombinedFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple(),
    myFormat
);
var logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: config.get('logLevel'),
            format: myCombinedFormat,
        }),
        new winston.transports.File({
            filename: defaultLogFile,
            level: config.get('logLevel'),
            format: myCombinedFormat,
        })
    ],
});

global.logger  = logger;
module.exports = logger;
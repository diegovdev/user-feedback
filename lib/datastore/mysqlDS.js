'use strict';
const Umzug     = require('umzug');
const path      = require('path');
const Sequelize = require('../models').Sequelize;
const sequelize = require('../models').sequelize;
const config    = require('../../config/config');
const dbConfig  = config.get('database');
const logger    = require('../logger/logger');
const mysql     = require('mysql2/promise');



/**
 * @class MySqlDS
 */
function MySqlDS() {
}


/**
 * Initializes the database
 * @function init
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @return nothing
 */
MySqlDS.init = function() {
    MySqlDS.initDatabase(function() {
        MySqlDS.testConnection(function() {
            MySqlDS.createTablesViaMigrations();
        });
    });
};


/**
 * Create the database if it doesn't exist
 * @function initDatabase
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @return nothing
 */
MySqlDS.initDatabase = function(callback) {
    mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password
    }).then(function (connection) {
        connection.query('CREATE DATABASE IF NOT EXISTS ' + dbConfig.database + ';')
        .then(function () {
            logger.info('[database]', 'Database ready: ' + dbConfig.database);

            if(callback && typeof callback === 'function') {
                callback();
            }
        })
        .catch(function (err) {
            logger.error('[database]', 'Unable to create database:', err);
        });
    })
    .catch(function (err) {
        logger.error('[database]', 'Unable to connect to the database:', err);
    });
};


/**
 * Tests the connection to the database
 * @function testConnection
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @return nothing
 */
MySqlDS.testConnection = function(callback) {
    sequelize.authenticate()
    .then(function() {
        logger.info('[sequelize]', 'Connection has been established successfully');

        if(callback && typeof callback === 'function') {
            callback();
        }
    })
    .catch(function(err) {
        logger.info('[sequelize]', 'Unable to connect to the database:', err);
    });
};


/**
 * Creates tables for all the models if they don't exist
 * @function createTablesViaModelSync
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @return nothing
 */
MySqlDS.createTablesViaModelSync = function(callback) {
    sequelize.sync();
    logger.info('[sequelize]', 'Tables created');

    if(callback && typeof callback === 'function') {
        callback();
    }
};


/**
 * Runs all the migrations programatically
 * @function createTablesViaMigrations
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @return nothing
 */
MySqlDS.createTablesViaMigrations = function(callback) {
    try {
        const umzug = new Umzug({
            storage: "sequelize",
            storageOptions: {
                sequelize: sequelize
            },
            migrations: {
                params: [
                    sequelize.getQueryInterface(),
                    Sequelize
                ],
                path: path.join(process.cwd(), "/database/migrations")
            }
        });
        umzug.up();
        logger.info('[sequelize]', 'Migrations finished');
    }
    catch (err) {
        logger.info('[sequelize]', 'Error while running the migrations:', err);
    }
    if(callback && typeof callback === 'function') {
        callback();
    }
};


module.exports = MySqlDS;

'use strict';
const Umzug     = require('umzug');
const path      = require('path');
const models    = require('../models');
const User      = models.User;
const Feedback  = models.Feedback;
const Session   = models.Session;
const Sequelize = models.Sequelize;
const sequelize = models.sequelize;
const config    = require('../../config/config');
const dbConfig  = config.get('database');
const logger    = require('../../lib/logger/logger');
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
MySqlDS.init = function(callback) {
    callback = callback || function() {};
    MySqlDS.initDatabase(function() {
        MySqlDS.testConnection(function() {
            MySqlDS.createTablesViaMigrations(callback);
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
 * Creates tables for all the models if they don't exist, this will disregard the migrations and wont update
 * the database if the tables already exist. It will only create the tables if they don't already exist and using
 * the current state of the models.
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
 * Runs all the migrations programmatically
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

/**
 * Deletes all data in the database programmatically
 * @function resetData
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @return nothing
 */
MySqlDS.resetData = function(callback) {
    callback = callback || function () {};
    let removeAll = async function() {
        await User.destroy({ where: {} });
        await Session.destroy({ where: {} });
        await Feedback.destroy({ where: {} });
    };
    removeAll()
    .then(function() {
        callback();
    })
    .catch(function (error) {
        throw new Error(error);
    });
};

/**
 * Checks if a user exists in database based on its Id
 * @function existsUser
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param user object containing the id
 * @return boolean or null in case of error
 */
MySqlDS.existsUser = function(user) {
    return User.findAll({
        where: {
            id: user.id
        }
    })
    .then(results => {
        return results.length > 0;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while searching for User:', error);
        return null;
    });
};

/**
 * Creates a new user based on the passed object
 * @function createUser
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param user object containing the properties
 * @return created entry id or null in case of error
 */
MySqlDS.createUser = function(user) {
    return User.build(user).save()
    .then(newUser => {
        return newUser.dataValues.id;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while creating new User:', error);
        return null;
    });
};

/**
 * Checks if a session exists in database based on its Id
 * @function existsSession
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param session object containing the id
 * @return boolean or null in case of error
 */
MySqlDS.existsSession = async function(session) {
    return Session.findAll({
        where: {
            id: session.id
        }
    })
    .then(results => {
        return results.length > 0;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while searching for Session:', error);
        return null;
    });
};

/**
 * Creates a new session based on the passed object
 * @function createSession
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param session object containing the properties
 * @return created entry id or null in case of error
 */
MySqlDS.createSession = function(session) {
    return Session.build(session).save()
    .then(newSession => {
        return newSession.dataValues.id;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while creating new Session:', error);
        return null;
    });
};

/**
 * Checks if a feedback already exists for the given userId and sessionId
 * @function existsFeedback
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param userId id of a user
 * @param sessionId id of a session
 * @return boolean or null in case of error
 */
MySqlDS.existsFeedback = async function(userId, sessionId) {
    return Feedback.findAll({
        where: {
            userId: userId,
            sessionId: sessionId
        }
    })
    .then(results => {
        return results.length > 0;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while searching for Feedback:', error);
        return null;
    });
};

/**
 * Creates a new feedback based on the passed object
 * @function createFeedback
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param feedback object containing the properties
 * @return created entry id or null in case of error
 */
MySqlDS.createFeedback = function(feedback) {
    return Feedback.build(feedback).save()
    .then(newFeedback => {
        return newFeedback.dataValues.id;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while creating new Feedback:', error);
        return null;
    });
};

/**
 * Retrieves a feedback entry based on the passed id
 * @function getFeedback
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param feedbackId id of a feedback
 * @return array of results or null in case of error
 */
MySqlDS.getFeedback = function(feedbackId) {
    return Feedback.findAll({
        where: {
            id: feedbackId,
        }
    })
    .then(results => {
        let response = [];
        results.forEach(function (entry, index) {
           response[index] = entry.dataValues;
        });
        return response;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while retrieving Feedback:', error);
        return null;
    });
};

/**
 * Retrieves last feedback entries ordered by creation date descendant, filters.rating parameter will define which rating value
 * to filter for, limit parameter will change the limit of results returned, by default it is 15.
 * @function findFeedbacks
 * @memberof MySqlDS
 * @author Diego Carvallo
 * @param filters object that holds filters like 'rating'
 * @param limit change the limit of results returned, by default it is 15
 * @return array of results or null in case of error
 */
MySqlDS.findFeedbacks = function(filters, limit) {
    return Feedback.findAll({
        where: filters,
        limit: limit || null,
        order: [
            ['createdAt', 'DESC']
        ],
    })
    .then(results => {
        let response = [];
        results.forEach(function (entry, index) {
           response[index] = entry.dataValues;
        });
        return response;
    })
    .catch(error => {
        logger.error('[sequelize]', 'Error while searching for Feedback:', error);
        return null;
    });
};


module.exports = MySqlDS;

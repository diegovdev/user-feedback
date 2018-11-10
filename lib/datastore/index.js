const logger            = require('../logger/logger');
const config            = require('../../config/config');
const memoryDS          = require('./memoryDS');
const mysqlDS           = require('./mysqlDS');
const datastore         = config.get('app:datastore');
const validationMode    = config.get('app:validationMode');

if(datastore !== 'memory' && datastore !== 'mysql') {
    throw new Error('Invalid "datastore", allowed values are: memory|mysql');
}
if(validationMode !== 'strict' && validationMode !== 'permissive') {
    throw new Error('Invalid "validationMode", allowed values are: strict|permissive');
}

var ds = null;
if(datastore === 'mysql') {
    ds = mysqlDS;
} else {
    ds = memoryDS;
}


/**
 * @class DataStore
 */
function DataStore() {
}

DataStore._dataStore = {
    feedback: [],

};

DataStore.getSession = function(req, callback) {

};

DataStore.createFeedback = async function(req, callback) {
    callback = callback || function(){};
    let sessionId = req.params && req.params.sessionId ? req.params.sessionId.toString().trim() : "";
    if(!sessionId) {
        callback(true, {message: 'You must provide a value for sessionId.'});
        return;
    }
    let data = req.body;
    if(!data || typeof data !== 'object') {
        callback(true, {message: 'Missing request body with feedback parameters.'});
        return;
    }
    let userId = data.userId ? data.userId.toString().trim() : "";
    if(!userId) {
        callback(true, {message: 'You must provide a value for userId.'});
        return;
    }
    if(!data.rating) {
        callback(true, {message: 'You must provide a value for rating.'});
        return;
    }
    let rating = data.rating;
    let regNum = /^\d+$/;
    if(!regNum.test(rating)) {
        callback(true, {message: 'Invalid value for rating, the allowed values are: 1|2|3|4|5.'});
        return;
    }
    rating = parseFloat(data.rating);
    if(rating < 1 || rating > 5) {
        callback(true, {message: 'Invalid value for rating, the allowed values are: 1|2|3|4|5.'});
        return;
    }
    rating = parseInt(data.rating, 10);
    if(rating < 1 || rating > 5) {
        callback(true, {message: 'Invalid value for rating, the allowed values are: 1|2|3|4|5.'});
        return;
    }

    let user = {
        id: userId
    };

    let session = {
        id: sessionId
    };

    let feedback = {
        userId: userId,
        sessionId: sessionId,
        rating: rating,
        comment: data.comment
    };

    let existsUser = await ds.existsUser(user);
    if(existsUser === null) {
        callback(true, {message: 'Error querying for User.'});
        return;
    }
    let existsSession = await ds.existsSession(session);
    if(existsSession === null) {
        callback(true, {message: 'Error querying for Session.'});
        return;
    }

    if(validationMode === 'strict') {
        //in strict mode the user and session must exist
        if(!existsUser) {
            callback(true, {message: 'User with id=' + userId + ' does not exist.'});
            return;
        }
        if(!existsSession) {
            callback(true, {message: 'Session with id=' + sessionId + ' does not exist.'});
            return;
        }
    } else {
        //in permissive mode if user and session do not exist then we create them first
        if(!existsUser) {
            user.email = 'user' + userId + '@ubi.soft';
            user.nickname = 'nick-' + userId;
            let response = await ds.createUser(user);
            if(response === null) {
                callback(true, {message: 'An error occurred while attempting to create a User.'});
                return;
            }
        }
        if(!existsSession) {
            session.gameId = 'game-ddd-fff';
            session.startDate = new Date();
            session.endDate = new Date();
            let response = await ds.createSession(session);
            if(response === null) {
                callback(true, {message: 'An error occurred while attempting to create a Session.'});
                return;
            }
        }
    }

    let existsFeedback = await ds.existsFeedback(userId, sessionId);
    if(existsFeedback) {
        callback(true, {message: 'Feedback for sessionId=' + sessionId + ' and userId=' + userId + ' was already submitted.'});
        return;
    }

    let response = await ds.createFeedback(feedback);
    if(response === null) {
        callback(true, {message: 'An error occurred while attempting to create a Feedback.'});
        return;
    } else {
        callback(false, {message: 'Feedback successfully created with id=' + response + '.', id: response});
        return;
    }
};

DataStore.getAllFeedbacks = function(req, callback) {
    callback = callback || function(){};

    ds.getAllFeedbacks(callback);
}

module.exports = DataStore;
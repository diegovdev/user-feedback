const logger            = require('../logger/logger');
const config            = require('../../config/config');
const validator         = require('../validator');
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

DataStore.getSession = function(req, callback) {
    callback = callback || function(){};
    callback(false, {message: 'Not implemented.'});
};

DataStore.createFeedback = async function(req, callback) {
    callback = callback || function(){};
    let sessionId = req.params && req.params.sessionId ? req.params.sessionId.toString().trim() : "";
    if(!sessionId) {
        callback(true, {message: 'You must provide a value for `sessionId` in the url.'});
        return;
    }
    let data = req.body;
    if(!data || typeof data !== 'object') {
        callback(true, {message: 'Missing request body with feedback parameters.'});
        return;
    }
    let headerUserId = req.headers['ubi-userid'] ? req.headers['ubi-userid'].toString().trim() : "";
    if(!headerUserId) {
        headerUserId = req.headers['Ubi-UserId'] ? req.headers['Ubi-UserId'].toString().trim() : "";
    }
    let bodyUserId = data['ubi-userid'] ? data['ubi-userid'].toString().trim() : "";
    if(!bodyUserId) {
        bodyUserId = data['Ubi-UserId'] ? data['Ubi-UserId'].toString().trim() : "";
    }
    if(headerUserId && bodyUserId) {
        callback(true, {message: 'Please provide only one value for `Ubi-UserId` either as a header or in the body.'});
        return;
    }
    let userId = headerUserId || bodyUserId;
    if(!userId) {
        callback(true, {message: 'You must provide a value for `Ubi-UserId` either as a header or in the body.'});
        return;
    }
    if(!data.rating) {
        callback(true, {message: 'You must provide a value for `rating` in the body.'});
        return;
    }
    if(!data.comment) {
        callback(true, {message: 'You must provide a value for `comment` in the body.'});
        return;
    }
    let rating = validator.validateInteger(data.rating);
    if(rating === false || rating < 1 || rating > 5) {
        callback(true, {message: 'Invalid value for `rating`, the allowed values are: 1|2|3|4|5.'});
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

DataStore.findFeedbacks = async function(req, callback) {
    callback = callback || function(){};

    let filters = {};
    let limit = null;
    let rating = null;
    if(req.query) {
        if(req.query.limit) {
            limit = validator.validateInteger(req.query.limit);
            if(limit === false || limit < 1) {
                callback(true, {message: 'Invalid value for `limit`, the allowed values are: Any integer greater than 0.'});
                return;
            }
        }
        if(req.query.rating) {
            rating = validator.validateInteger(req.query.rating);
            if(rating === false || rating < 1 || rating > 5) {
                callback(true, {message: 'Invalid value for `rating`, the allowed values are: 1|2|3|4|5.'});
                return;
            }
            filters.rating = rating;
        }
    }
    //default limit is 15
    if(limit === null) {
        limit = 15;
    }
    let response = await ds.findFeedbacks(filters, limit);
    if(response === null) {
        callback(true, {message: 'An error occurred while attempting to retrieve Feedbacks.'});
        return;
    } else {
        callback(false, {limit: limit, filters: filters, count: response.length, result: response});
        return;
    }
}

module.exports = DataStore;
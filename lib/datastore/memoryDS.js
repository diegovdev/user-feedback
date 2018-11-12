var logger      = require('../logger/logger');
var feedbackAutoIncrement = 0;
/**
 * @class MemoryDS
 */
function MemoryDS() {
}

MemoryDS._dataStore = {
    users: [],
    userIds: [],
    sessions: [],
    sessionIds: [],
    feedbacks: [],
    feedbackIds: [],
};

MemoryDS.resetData = function(callback) {
    callback = callback || function () {};
    MemoryDS._dataStore = {
        users: [],
        userIds: [],
        sessions: [],
        sessionIds: [],
        feedbacks: [],
        feedbackIds: [],
    };
    callback();
};

MemoryDS.existsUser = async function(user) {
    return this._dataStore['userIds'].includes(user.id);
};

MemoryDS.createUser = async function(user) {
    user.createdAt = new Date();
    user.updatedAt = new Date();
    this._dataStore['users'].push(user);
    this._dataStore['userIds'].push(user.id);
    return user.id;
};

MemoryDS.existsSession = async function(session) {
    return this._dataStore['sessionIds'].includes(session.id);
};

MemoryDS.createSession = async function(session) {
    session.createdAt = new Date();
    session.updatedAt = new Date();
    this._dataStore['sessions'].push(session);
    this._dataStore['sessionIds'].push(session.id);
    return session.id;
};

MemoryDS.existsFeedback = async function(userId, sessionId) {
    return this._dataStore['feedbackIds'].includes(userId+'_'+sessionId);
};

MemoryDS.createFeedback = async function(feedback) {
    feedback.createdAt = new Date();
    feedback.updatedAt = new Date();
    feedbackAutoIncrement++;
    feedback.id = feedbackAutoIncrement;
    this._dataStore['feedbacks'].push(feedback);
    this._dataStore['feedbackIds'].push(feedback.userId+'_'+feedback.sessionId);
    return feedback.id;
};

MemoryDS.getFeedback = function(feedbackId) {
    let results = [];
    let feedbacks = this._dataStore['feedbacks'];
    for(let i = 0; i < feedbacks.length; i++) {
        let entry = feedbacks[i];
        if(feedbackId == entry.id) {
            results.push(entry);
        }
    }
    return results;
};

MemoryDS.findFeedbacks = async function(filters, limit) {
    let results = [];
    let feedbacks = this._dataStore['feedbacks'];
    for(let i = feedbacks.length-1; i >= 0 ; i--) {
        let entry = feedbacks[i];
        if(results.length < limit) {
            if(filters.rating) {
                if(filters.rating == entry.rating) {
                    results.push(entry);
                }
            } else {
                results.push(entry);
            }
        }
    }
    return results;
};

module.exports = MemoryDS;
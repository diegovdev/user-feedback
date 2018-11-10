var logger      = require('../logger/logger');
var feedbackAutoIncrement = -1;
/**
 * @class MemoryDS
 */
function MemoryDS() {
}

MemoryDS._dataStore = {
    feedback: [],

};

MemoryDS.existsUser = async function(user) {
    return true;
};

MemoryDS.createUser = async function(user) {
    return true;
};

MemoryDS.existsSession = async function(session) {
    return true;
};

MemoryDS.createSession = async function(session) {
    return true;
};

MemoryDS.existsFeedback = async function(userId, sessionId) {
    return false;
};

MemoryDS.createFeedback = async function(feedback) {
    feedbackAutoIncrement++;
    feedback.id = feedbackAutoIncrement;
    this._dataStore['feedback'].push(feedback);

    return feedback.id;
};

MemoryDS.getAllFeedbacks = function(callback) {
    callback = callback || function(){};

    callback(false, this._dataStore['feedback']);
}

module.exports = MemoryDS;
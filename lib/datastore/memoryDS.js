var logger      = require('../logger/logger');

/**
 * @class MemoryDS
 */
function MemoryDS() {
}

MemoryDS._dataStore = {
    feedback: [],

};

MemoryDS.storeFeedback = function getUserList(feedback, callback) {
    if(feedback && typeof feedback === 'object') {
        var entry = {
            gameId: feedback.gameId,
            sessionId: feedback.sessionId,
            userId: feedback.userId,
            rating: feedback.rating,
            message: feedback.message
        };
        this._dataStore['feedback'].push(entry);
    }

    if(callback && typeof callback === 'function') {
        callback();
    }
};

MemoryDS.getAllFeedbacks = function getUserList() {
    return this._dataStore['feedback'];
}

module.exports = MemoryDS;
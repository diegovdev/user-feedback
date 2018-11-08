var logger      = require('../lib/logger/logger');
var memoryDS    = require('../lib/datastore/memoryDS');

/**
 * @class FeedbackController
 */
function FeedbackController() {
}

/**
 * Returns the last 15 feedback entries
 * @function getLastFeedbacks
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request that contains userId, authHash, siteName
 * @param {object} res - express response object
 * @return {html} html rendered page
 */
FeedbackController.getLastFeedbacks = function getUserList(req, res, next) {
    logger.info('[FeedbackController.getLastFeedbacks]', 'replying feedback list');
    res.json(memoryDS.getAllFeedbacks());
};

/**
 * Adds a feedback entry
 * @function getLastFeedbacks
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request that contains userId, authHash, siteName
 * @param {object} res - express response object
 * @return {html} html rendered page
 */
FeedbackController.addFeedback = function getUserList(req, res, next) {
    logger.info('[FeedbackController.addFeedback]', 'replying feedback list', req.body);
    memoryDS.storeFeedback(req.body);
    res.json({error: false, message: 'entry added'});
};


module.exports = FeedbackController;
const logger      = require('../logger/logger');
const memoryDS    = require('../datastore/memoryDS');

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
 * @param {object} req - http request that contains ????????????
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.getLastFeedbacks = function getUserList(req, res, next) {
    logger.info('[FeedbackController.getLastFeedbacks]', 'replying feedback list');
    res.json(memoryDS.getAllFeedbacks());
};

/**
 * Adds a feedback entry
 * @function addFeedback
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request that contains ????????????
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.addFeedback = function getUserList(req, res, next) {
    logger.info('[FeedbackController.addFeedback]', 'replying feedback list', req.body);
    memoryDS.storeFeedback(req.body);
    res.json({error: false, message: 'entry added'});
};


module.exports = FeedbackController;
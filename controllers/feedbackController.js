var logger      = require('../lib/logger/logger');

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
    // res.send('respond with a resource');
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
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
    logger.info('[FeedbackController.addFeedback]', 'replying feedback list');
    res.json({error: false, message: 'entry added'});
};


module.exports = FeedbackController;
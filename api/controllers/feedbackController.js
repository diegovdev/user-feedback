const logger      = require('../../lib/logger/logger');
const datastore   = require('../../engine/datastore');

/**
 * @class FeedbackController
 */
function FeedbackController() {
}


/**
 * Adds a feedback entry
 * @function addFeedback
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request object
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.createFeedback = function(req, res, next) {
    logger.info('[FeedbackController.createFeedback]', 'creating feedback', req.body);
    datastore.createFeedback(req, function(err, data) {
        if(err) {
            res.json({
                status: 'error',
                error: data
            });
        } else {
            res.json({
                status: 'ok',
                data: data
            });
        }
    });
};

/**
 * Returns the last 15 feedback entries
 * @function getLastFeedbacks
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request object
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.getLastFeedbacks = function(req, res, next) {
    logger.info('[FeedbackController.getLastFeedbacks]', 'replying feedback list');
    datastore.findFeedbacks(req, function(err, data) {
        if(err) {
            res.json({
                status: 'error',
                error: data
            });
        } else {
            res.json({
                status: 'ok',
                data: data
            });
        }
    });
};

/**
 * Retrieves Feedback info
 * @function getFeedback
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request object
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.getFeedback = function(req, res, next) {
    logger.info('[FeedbackController.getFeedback]', 'retrieving feedback info');
    datastore.getFeedback(req, function(err, data) {
        if(err) {
            res.json({
                status: 'error',
                error: data
            });
        } else {
            res.json({
                status: 'ok',
                data: data
            });
        }
    });
};

/**
 * Updates a Feedback data
 * @function updateFeedback
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request object
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.updateFeedback = function(req, res, next) {
    logger.info('[FeedbackController.updateFeedback]', 'updating feedback');
    datastore.updateFeedback(req, function(err, data) {
        if(err) {
            res.json({
                status: 'error',
                error: data
            });
        } else {
            res.json({
                status: 'ok',
                data: data
            });
        }
    });
};


module.exports = FeedbackController;
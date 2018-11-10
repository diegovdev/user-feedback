const logger      = require('../logger/logger');
const datastore   = require('../datastore');

/**
 * @class FeedbackController
 */
function FeedbackController() {
}

/**
 * Returns session info
 * @function getSession
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request that contains ????????????
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.getSession = function(req, res, next) {
    logger.info('[FeedbackController.getSession]', 'replying session info');
    datastore.getSession(req, function(err, data) {
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
 * Adds a feedback entry
 * @function addFeedback
 * @memberof FeedbackController
 * @author Diego Carvallo
 * @param {object} req - http request that contains ????????????
 * @param {object} res - express response object
 * @return {json} json response
 */
FeedbackController.addFeedback = function(req, res, next) {
    logger.info('[FeedbackController.addFeedback]', 'replying feedback list', req.body);
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
 * @param {object} req - http request that contains ????????????
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


module.exports = FeedbackController;
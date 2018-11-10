const logger      = require('../logger/logger');
const datastore   = require('../datastore');

/**
 * @class SessionController
 */
function SessionController() {
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
SessionController.getSession = function(req, res, next) {
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

module.exports = SessionController;
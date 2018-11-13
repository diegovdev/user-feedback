const logger      = require('../../lib/logger/logger');
const datastore   = require('../../engine/datastore');

/**
 * @class SessionController
 */
function SessionController() {
}

/**
 * Returns session info
 * @function getSession
 * @memberof SessionController
 * @author Diego Carvallo
 * @param {object} req - http request object
 * @param {object} res - express response object
 * @return {json} json response
 */
SessionController.getSession = function(req, res, next) {
    logger.info('[SessionController.getSession]', 'replying session info');
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
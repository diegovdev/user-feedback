var express     = require('express');
var router      = express.Router();
var config      = require('../../config/config');
var logger      = require('../../lib/logger/logger');

/* GET home page. */
router.get('/', function indexRouter(req, res, next) {
    logger.info('[routes.index]', 'called %s', 'route /');
    logger.error('[routes.index]', 'test %s', 'error');
    var appName = config.get('app:name');
    res.render('index', {title: appName});
});

module.exports = router;

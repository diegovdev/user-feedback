var express     = require('express');
var router      = express.Router();
var config      = require('../config/config');

/* GET home page. */
router.get('/', function (req, res, next) {
    var appName = config.get('app:name');
    res.render('index', {title: appName});
});

module.exports = router;

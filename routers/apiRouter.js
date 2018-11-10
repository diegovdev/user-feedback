var express             = require('express');
var router              = express.Router();
var sessionController   = require(__dirname+'/../lib/controllers/sessionController');
var feedbackController  = require(__dirname+'/../lib/controllers/feedbackController');


router.get ('/session/:sessionId', sessionController.getSession);
router.post('/feedback/create/', feedbackController.createFeedback);
router.post('/feedback/create/:sessionId', feedbackController.createFeedback);
router.get ('/feedback/find', feedbackController.getLastFeedbacks);


module.exports = router;

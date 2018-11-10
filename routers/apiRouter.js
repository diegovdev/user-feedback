var express             = require('express');
var router              = express.Router();
var feedbackController  = require(__dirname+'/../lib/controllers/feedbackController');


router.get ('/session/:sessionId', feedbackController.getSession);
router.post('/session/:sessionId/feedback', feedbackController.addFeedback);
router.get ('/session/:sessionId/feedback', feedbackController.getLastFeedbacks);


module.exports = router;

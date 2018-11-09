var express             = require('express');
var router              = express.Router();
var feedbackController  = require(__dirname+'/../lib/controllers/feedbackController');


router.get ('/feedback', feedbackController.getLastFeedbacks);
router.post('/feedback', feedbackController.addFeedback);


module.exports = router;

var express             = require('express');
var router              = express.Router();
var sessionController   = require('../controllers/sessionController');
var feedbackController  = require('../controllers/feedbackController');


router.post ('/feedback/create/', feedbackController.createFeedback);
router.post ('/feedback/create/:sessionId', feedbackController.createFeedback);
router.get  ('/feedback/find/:feedbackId', feedbackController.getFeedback);
router.get  ('/feedback/find', feedbackController.getLastFeedbacks);

//NOT implemented
router.get  ('/session/', sessionController.getSession);
router.get  ('/session/:sessionId', sessionController.getSession);
router.put  ('/feedback/create/', feedbackController.updateFeedback);
router.put  ('/feedback/create/:sessionId', feedbackController.updateFeedback);
router.patch('/feedback/create/', feedbackController.updateFeedback);
router.patch('/feedback/create/:sessionId', feedbackController.updateFeedback);
router.put  ('/feedback/', feedbackController.updateFeedback);
router.put  ('/feedback/:feedbackId', feedbackController.updateFeedback);
router.patch('/feedback/', feedbackController.updateFeedback);
router.patch('/feedback/:feedbackId', feedbackController.updateFeedback);



module.exports = router;

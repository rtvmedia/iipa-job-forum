const router = require('express').Router();
const { applyToJob, getSeekerApplications, getJobApplicants, updateApplicationStatus } = require('../controllers/applicationController');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/',                              authenticate, requireRole('seeker'),    applyToJob);
router.get('/my',                             authenticate, requireRole('seeker'),    getSeekerApplications);
router.get('/job/:jobId',                     authenticate, requireRole('recruiter'), getJobApplicants);
router.put('/:id/status',                     authenticate, requireRole('recruiter'), updateApplicationStatus);

module.exports = router;

const router = require('express').Router();
const { getAllJobs, getJobById, createJob, updateJob, deleteJob, getRecruiterJobs } = require('../controllers/jobController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/',                getAllJobs);
router.get('/my',              authenticate, requireRole(['recruiter','admin']), getRecruiterJobs);
router.get('/:id',             getJobById);
router.post('/',               authenticate, requireRole(['recruiter','admin']), createJob);
router.put('/:id',             authenticate, requireRole(['recruiter','admin']), updateJob);
router.delete('/:id',          authenticate, requireRole(['recruiter','admin']), deleteJob);

module.exports = router;

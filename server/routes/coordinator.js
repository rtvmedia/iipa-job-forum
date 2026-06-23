const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { submitJob, getMySubmissions } = require('../controllers/coordinatorController');

router.use(authenticate, requireRole('coordinator'));

router.post('/jobs',     submitJob);
router.get('/jobs/mine', getMySubmissions);

module.exports = router;

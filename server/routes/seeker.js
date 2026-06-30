const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/seekerController');

router.use(authenticate, requireRole('seeker'));

router.get('/work-experience',        ctrl.getWorkExperiences);
router.post('/work-experience',       ctrl.addWorkExperience);
router.put('/work-experience/:id',    ctrl.updateWorkExperience);
router.delete('/work-experience/:id', ctrl.deleteWorkExperience);

router.get('/education',        ctrl.getEducations);
router.post('/education',       ctrl.addEducation);
router.put('/education/:id',    ctrl.updateEducation);
router.delete('/education/:id', ctrl.deleteEducation);

router.get('/certifications',        ctrl.getCertifications);
router.post('/certifications',       ctrl.addCertification);
router.put('/certifications/:id',    ctrl.updateCertification);
router.delete('/certifications/:id', ctrl.deleteCertification);

router.get('/saved-jobs',           ctrl.getSavedJobs);
router.post('/saved-jobs',          ctrl.saveJob);
router.delete('/saved-jobs/:jobId', ctrl.unsaveJob);

router.get('/projects',        ctrl.getProjects);
router.post('/projects',       ctrl.addProject);
router.put('/projects/:id',    ctrl.updateProject);
router.delete('/projects/:id', ctrl.deleteProject);

router.get('/references',        ctrl.getReferences);
router.post('/references',       ctrl.addReference);
router.put('/references/:id',    ctrl.updateReference);
router.delete('/references/:id', ctrl.deleteReference);

router.post('/avatar', upload.uploadMemory.single('avatar'), ctrl.uploadAvatar);

module.exports = router;

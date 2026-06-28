const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/adminController');

router.use(authenticate, requireRole('admin'));

router.get('/users',              ctrl.getUsers);
router.put('/users/:id',          ctrl.updateUser);
router.delete('/users/:id',       ctrl.deleteUser);
router.put('/users/:id/role',     ctrl.assignRole);

router.get('/approvals',                  ctrl.getApprovals);
router.put('/approvals/users/:id',        ctrl.decideUserApproval);
router.put('/approvals/users/:id/edit',   ctrl.editUserApproval);
router.delete('/approvals/users/:id',     ctrl.deleteUserApproval);
router.put('/approvals/jobs/:id',         ctrl.decideJobApproval);
router.put('/approvals/jobs/:id/edit',    ctrl.editJobApproval);
router.delete('/approvals/jobs/:id',      ctrl.deleteJobApproval);

router.get('/coordinators', ctrl.getCoordinators);

router.get('/reports', ctrl.getReports);

router.get('/albums',                          ctrl.getAlbums);
router.post('/albums',                         upload.single('cover'), ctrl.createAlbum);
router.put('/albums/:id',                      upload.single('cover'), ctrl.updateAlbum);
router.delete('/albums/:id',                   ctrl.deleteAlbum);
router.post('/albums/:id/images',              upload.single('image'), ctrl.addAlbumImage);
router.delete('/albums/:id/images/:imageId',   ctrl.deleteAlbumImage);

router.put('/settings', upload.uploadMemory.fields([
  { name: 'headerLogo', maxCount: 1 },
  { name: 'footerLogo', maxCount: 1 },
  { name: 'seekerBarcode', maxCount: 1 },
  { name: 'employerBarcode', maxCount: 1 },
]), ctrl.updateSettings);
router.delete('/settings/seeker-barcode',   ctrl.deleteSeekerBarcode);
router.delete('/settings/employer-barcode', ctrl.deleteEmployerBarcode);

router.get('/jobs',           ctrl.getAllJobsAdmin);
router.post('/jobs',          ctrl.createJobAdmin);
router.put('/jobs/:id',       ctrl.updateJobAdmin);
router.delete('/jobs/:id',    ctrl.deleteJobAdmin);

module.exports = router;

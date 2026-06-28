const { Op, fn, col, literal } = require('sequelize');
const { User, Job, Application, Album, AlbumImage, Event, SiteSetting } = require('../models');

// ---------- Users ----------
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateUser = async (req, res) => {
  try {
    const { fullName, email, role, isActive, approvalStatus, nationality } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update({ fullName, email, role, isActive, approvalStatus, nationality });
    const clean = await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
    res.json(clean);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) return res.status(400).json({ message: "You can't delete your own account" });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const assignRole = async (req, res) => {
  try {
    const { role } = req.body; // 'coordinator' | 'admin' | 'seeker' | 'recruiter'
    if (!['seeker', 'recruiter', 'coordinator', 'admin'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update({ role, approvalStatus: 'approved', isActive: true });
    const clean = await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
    res.json(clean);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---------- Approvals (pending users + coordinator-submitted jobs) ----------
const getApprovals = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({ where: { approvalStatus: 'pending' }, attributes: { exclude: ['password'] } });
    const pendingJobs  = await Job.findAll({
      where: { approvalStatus: 'pending' },
      include: [{ model: User, as: 'coordinator', attributes: ['fullName', 'email'] }],
    });
    res.json({
      users: pendingUsers,
      jobs: pendingJobs,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const decideUserApproval = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' | 'reject'
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update({ approvalStatus: action === 'approve' ? 'approved' : 'rejected', isActive: action === 'approve' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const decideJobApproval = async (req, res) => {
  try {
    const { action } = req.body;
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.update({ approvalStatus: action === 'approve' ? 'approved' : 'rejected', isActive: action === 'approve' });
    res.json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const editUserApproval = async (req, res) => {
  try {
    const { fullName, email, nationality } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update({ fullName, email, nationality });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const editJobApproval = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.update({ title, company, location, description });
    res.json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteUserApproval = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'Approval request removed (user deleted)' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteJobApproval = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.destroy();
    res.json({ message: 'Approval request removed (job deleted)' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---------- Coordinators ----------
const getCoordinators = async (req, res) => {
  try {
    const coordinators = await User.findAll({ where: { role: 'coordinator' }, attributes: { exclude: ['password'] } });
    const results = await Promise.all(coordinators.map(async (c) => {
      const submissions = await Job.count({ where: { coordinatorId: c.id } });
      const approved    = await Job.count({ where: { coordinatorId: c.id, approvalStatus: 'approved' } });
      return { ...c.toJSON(), submissions, approved };
    }));
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---------- Reports ----------
const getReports = async (req, res) => {
  try {
    const totalJobs         = await Job.count();
    const totalApplications = await Application.count();
    const activeRecruiters  = await User.count({ where: { role: 'recruiter' } });
    const activeSeekers     = await User.count({ where: { role: 'seeker' } });
    const pendingApprovals  = (await User.count({ where: { approvalStatus: 'pending' } })) + (await Job.count({ where: { approvalStatus: 'pending' } }));

    const jobsByCategory = await Job.findAll({
      attributes: ['category', [fn('COUNT', col('id')), 'count']],
      group: ['category'],
      raw: true,
    });

    const applicationsOverTime = await Application.findAll({
      attributes: [[fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'], [fn('COUNT', col('id')), 'count']],
      group: [literal('month')],
      order: [[literal('month'), 'ASC']],
      raw: true,
    });

    const recruiters = await User.findAll({ where: { role: 'recruiter' }, attributes: ['id', 'fullName', 'email'] });
    const recruiterPerformance = await Promise.all(recruiters.map(async (r) => {
      const jobsPosted = await Job.count({ where: { recruiterId: r.id } });
      const applicants  = await Application.count({ include: [{ model: Job, as: 'job', where: { recruiterId: r.id }, attributes: [] }] });
      return { recruiter: r.fullName, email: r.email, jobsPosted, applicants };
    }));

    res.json({
      summary: { totalJobs, totalApplications, activeRecruiters, activeSeekers, pendingApprovals },
      jobsByCategory,
      applicationsOverTime,
      recruiterPerformance,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---------- Albums ----------
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      include: [{ model: AlbumImage, as: 'images' }, { model: Event, as: 'event', attributes: ['title', 'eventDate'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(albums);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createAlbum = async (req, res) => {
  try {
    const { title, eventId } = req.body;
    const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const album = await Album.create({ title, eventId: eventId || null, coverImageUrl });
    res.status(201).json(album);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    const { title, eventId } = req.body;
    const updates = { title, eventId: eventId || null };
    if (req.file) updates.coverImageUrl = `/uploads/${req.file.filename}`;
    await album.update(updates);
    if (eventId) await Event.update({ title }, { where: { id: eventId } }).catch(() => {});
    res.json(album);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    await AlbumImage.destroy({ where: { albumId: album.id } });
    await album.destroy();
    res.json({ message: 'Album deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addAlbumImage = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const image = await AlbumImage.create({ albumId: album.id, imageUrl: `/uploads/${req.file.filename}` });
    res.status(201).json(image);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteAlbumImage = async (req, res) => {
  try {
    const image = await AlbumImage.findOne({ where: { id: req.params.imageId, albumId: req.params.id } });
    if (!image) return res.status(404).json({ message: 'Image not found' });
    await image.destroy();
    res.json({ message: 'Image deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---------- Branding ----------
const getSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create({});
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create({});
    const updates = {};
    if (req.files?.headerLogo?.[0])        updates.headerLogoUrl        = `/uploads/${req.files.headerLogo[0].filename}`;
    if (req.files?.footerLogo?.[0])        updates.footerLogoUrl        = `/uploads/${req.files.footerLogo[0].filename}`;
    if (req.files?.seekerBarcode?.[0])     updates.seekerBarcodeUrl     = `/uploads/${req.files.seekerBarcode[0].filename}`;
    if (req.files?.employerBarcode?.[0])   updates.employerBarcodeUrl   = `/uploads/${req.files.employerBarcode[0].filename}`;
    if (req.body.linkedinUrl !== undefined)         updates.linkedinUrl         = req.body.linkedinUrl;
    if (req.body.seekerWhatsappUrl !== undefined)   updates.seekerWhatsappUrl   = req.body.seekerWhatsappUrl;
    if (req.body.employerWhatsappUrl !== undefined) updates.employerWhatsappUrl = req.body.employerWhatsappUrl;
    await settings.update(updates);
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteSeekerBarcode   = async (req, res) => {
  const settings = await SiteSetting.findOne();
  await settings.update({ seekerBarcodeUrl: null });
  res.json(settings);
};
const deleteEmployerBarcode = async (req, res) => {
  const settings = await SiteSetting.findOne();
  await settings.update({ employerBarcodeUrl: null });
  res.json(settings);
};

// ---------- Jobs (full admin CRUD across all recruiters/coordinators) ----------
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        { model: User, as: 'recruiter', attributes: ['fullName', 'email'] },
        { model: User, as: 'coordinator', attributes: ['fullName', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createJobAdmin = async (req, res) => {
  try {
    const { title, company, location, type, category, description, requirements, salaryMin, salaryMax, deadline } = req.body;
    const job = await Job.create({
      recruiterId: req.user.id,
      title, company, location, type: type || 'full-time', category,
      description, requirements, salaryMin, salaryMax, deadline,
      approvalStatus: 'approved', isActive: true,
    });
    res.status(201).json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateJobAdmin = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.update(req.body);
    res.json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.destroy();
    res.json({ message: 'Job deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getUsers, updateUser, deleteUser, assignRole,
  getApprovals, decideUserApproval, decideJobApproval, editUserApproval, editJobApproval, deleteUserApproval, deleteJobApproval,
  getCoordinators,
  getReports,
  getAlbums, createAlbum, updateAlbum, deleteAlbum, addAlbumImage, deleteAlbumImage,
  getSettings, updateSettings, deleteSeekerBarcode, deleteEmployerBarcode,
  getAllJobsAdmin, createJobAdmin, updateJobAdmin, deleteJobAdmin,
};

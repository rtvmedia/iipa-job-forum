const { WorkExperience, Education, Certification, SavedJob, Job, User, Project, Reference } = require('../models');

// ---------- Work Experience ----------
const getWorkExperiences = async (req, res) => {
  const rows = await WorkExperience.findAll({ where: { userId: req.user.id }, order: [['startDate', 'DESC']] });
  res.json(rows);
};
const addWorkExperience = async (req, res) => {
  const row = await WorkExperience.create({ ...req.body, userId: req.user.id });
  res.status(201).json(row);
};
const updateWorkExperience = async (req, res) => {
  const row = await WorkExperience.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.update(req.body);
  res.json(row);
};
const deleteWorkExperience = async (req, res) => {
  const row = await WorkExperience.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  res.json({ message: 'Deleted' });
};

// ---------- Education ----------
const getEducations = async (req, res) => {
  const rows = await Education.findAll({ where: { userId: req.user.id }, order: [['graduationYear', 'DESC']] });
  res.json(rows);
};
const addEducation = async (req, res) => {
  const row = await Education.create({ ...req.body, userId: req.user.id });
  res.status(201).json(row);
};
const updateEducation = async (req, res) => {
  const row = await Education.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.update(req.body);
  res.json(row);
};
const deleteEducation = async (req, res) => {
  const row = await Education.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  res.json({ message: 'Deleted' });
};

// ---------- Certifications ----------
const getCertifications = async (req, res) => {
  const rows = await Certification.findAll({ where: { userId: req.user.id }, order: [['issueDate', 'DESC']] });
  res.json(rows);
};
const addCertification = async (req, res) => {
  const row = await Certification.create({ ...req.body, userId: req.user.id });
  res.status(201).json(row);
};
const updateCertification = async (req, res) => {
  const row = await Certification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.update(req.body);
  res.json(row);
};
const deleteCertification = async (req, res) => {
  const row = await Certification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  res.json({ message: 'Deleted' });
};

// ---------- Saved Jobs ----------
const getSavedJobs = async (req, res) => {
  const rows = await SavedJob.findAll({
    where: { userId: req.user.id },
    include: [{ model: Job, as: 'job', include: [{ model: User, as: 'recruiter', attributes: ['fullName'] }] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(rows.map(r => r.job).filter(Boolean));
};
const saveJob = async (req, res) => {
  const { jobId } = req.body;
  const [row] = await SavedJob.findOrCreate({ where: { userId: req.user.id, jobId } });
  res.status(201).json(row);
};
const unsaveJob = async (req, res) => {
  await SavedJob.destroy({ where: { userId: req.user.id, jobId: req.params.jobId } });
  res.json({ message: 'Removed' });
};

// ---------- Projects ----------
const getProjects = async (req, res) => {
  const rows = await Project.findAll({ where: { userId: req.user.id }, order: [['startDate', 'DESC']] });
  res.json(rows);
};
const addProject = async (req, res) => {
  const row = await Project.create({ ...req.body, userId: req.user.id });
  res.status(201).json(row);
};
const updateProject = async (req, res) => {
  const row = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.update(req.body);
  res.json(row);
};
const deleteProject = async (req, res) => {
  const row = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  res.json({ message: 'Deleted' });
};

// ---------- References ----------
const getReferences = async (req, res) => {
  const rows = await Reference.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
  res.json(rows);
};
const addReference = async (req, res) => {
  const row = await Reference.create({ ...req.body, userId: req.user.id });
  res.status(201).json(row);
};
const updateReference = async (req, res) => {
  const row = await Reference.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.update(req.body);
  res.json(row);
};
const deleteReference = async (req, res) => {
  const row = await Reference.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  res.json({ message: 'Deleted' });
};

// ---------- Avatar ----------
const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const { toDataUri } = require('../middleware/upload');
  const avatarUrl = toDataUri(req.file);
  await User.update({ avatarUrl }, { where: { id: req.user.id } });
  res.json({ avatarUrl });
};

module.exports = {
  getWorkExperiences, addWorkExperience, updateWorkExperience, deleteWorkExperience,
  getEducations, addEducation, updateEducation, deleteEducation,
  getCertifications, addCertification, updateCertification, deleteCertification,
  getSavedJobs, saveJob, unsaveJob,
  getProjects, addProject, updateProject, deleteProject,
  getReferences, addReference, updateReference, deleteReference,
  uploadAvatar,
};

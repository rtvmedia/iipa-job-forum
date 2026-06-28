const { WorkExperience, Education, Certification, SavedJob, Job, User } = require('../models');

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

module.exports = {
  getWorkExperiences, addWorkExperience, updateWorkExperience, deleteWorkExperience,
  getEducations, addEducation, updateEducation, deleteEducation,
  getCertifications, addCertification, updateCertification, deleteCertification,
  getSavedJobs, saveJob, unsaveJob,
};

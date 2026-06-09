const { Application, Job, User } = require('../models');

const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const exists = await Application.findOne({ where: { jobId, seekerId: req.user.id } });
    if (exists) return res.status(409).json({ message: 'Already applied to this job' });

    const application = await Application.create({
      jobId, seekerId: req.user.id, coverLetter, status: 'applied',
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSeekerApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { seekerId: req.user.id },
      include: [{ model: Job, as: 'job', attributes: ['title', 'company', 'location', 'type'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.jobId, recruiterId: req.user.id } });
    if (!job) return res.status(403).json({ message: 'Access denied' });

    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [{ model: User, as: 'seeker', attributes: ['fullName', 'email', 'phone', 'headline', 'location'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const app = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'job' }],
    });
    if (!app || app.job.recruiterId !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    await app.update({ status, notes });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { applyToJob, getSeekerApplications, getJobApplicants, updateApplicationStatus };

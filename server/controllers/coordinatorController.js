const { Job, Application, User } = require('../models');

const submitJob = async (req, res) => {
  try {
    const { title, company, location, type, category, description, requirements, salaryMin, salaryMax, deadline } = req.body;
    if (!title || !company || !description)
      return res.status(400).json({ message: 'Title, company, and description are required' });

    const job = await Job.create({
      recruiterId: req.user.id,
      coordinatorId: req.user.id,
      title, company, location, type: type || 'full-time', category,
      description, requirements, salaryMin, salaryMax, deadline,
      approvalStatus: 'pending',
      isActive: false,
    });
    res.status(201).json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMySubmissions = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { coordinatorId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { submitJob, getMySubmissions };

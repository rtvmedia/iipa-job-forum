const { Job, User, Application } = require('../models');
const { Op } = require('sequelize');

const getAllJobs = async (req, res) => {
  try {
    const { search, category, type, location } = req.query;
    const where = { isActive: true };
    if (search)   where.title       = { [Op.like]: `%${search}%` };
    if (category) where.category    = category;
    if (type)     where.type        = type;
    if (location) where.location    = { [Op.like]: `%${location}%` };

    const jobs = await Job.findAll({
      where,
      include: [{ model: User, as: 'recruiter', attributes: ['fullName', 'location'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: User, as: 'recruiter', attributes: ['fullName', 'location'] }],
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, company, location, type, category, description, requirements, salaryMin, salaryMax, deadline } = req.body;
    const job = await Job.create({
      recruiterId: req.user.id,
      title, company, location, type, category,
      description, requirements, salaryMin, salaryMax, deadline,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.id, recruiterId: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found or not yours' });
    await job.update(req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.id, recruiterId: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found or not yours' });
    await job.update({ isActive: false });
    res.json({ message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { recruiterId: req.user.id },
      include: [{ model: Application, as: 'applications' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob, getRecruiterJobs };

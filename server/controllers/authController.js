const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');
const { isValidLinkedIn, normalizeLinkedIn, REFERRAL_SOURCES } = require('../utils/validators');

const PUBLIC_ROLES = ['seeker', 'recruiter'];

const register = async (req, res) => {
  try {
    const { fullName, email, password, role, phone, location, linkedinProfile, referralSource, iipaReferredBy, iipaMemberId } = req.body;
    if (!fullName || !email || !password || !role)
      return res.status(400).json({ message: 'Missing required fields' });
    if (!PUBLIC_ROLES.includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    // Job seekers must give a LinkedIn profile and say how they heard about IIPA Jobs
    const seekerExtras = {};
    if (role === 'seeker') {
      if (!linkedinProfile || !isValidLinkedIn(linkedinProfile))
        return res.status(400).json({ message: 'Please enter a valid LinkedIn profile URL.' });
      if (!REFERRAL_SOURCES.includes(referralSource))
        return res.status(400).json({ message: 'Please tell us how you heard about IIPA Jobs.' });
      seekerExtras.linkedinProfile = normalizeLinkedIn(linkedinProfile);
      seekerExtras.referralSource  = referralSource;
      seekerExtras.iipaReferredBy  = String(iipaReferredBy || '').trim().slice(0, 150) || null;
      seekerExtras.iipaMemberId    = referralSource === 'IIPA Member' ? (String(iipaMemberId || '').trim().slice(0, 60) || null) : null;
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed, role, phone, location, ...seekerExtras });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const PROFILE_FIELDS = [
  'fullName', 'phone', 'location', 'headline', 'bio', 'companyName', 'companyWebsite', 'companyIndustry', 'companyAbout',
  'currentJobTitle', 'yearsOfExperience', 'willingToRelocate', 'visaStatus', 'nationality',
  'skills', 'languages', 'websiteUrl', 'linkedinProfile', 'githubProfile', 'portfolioUrl',
  'desiredJobTitle', 'preferredLocations', 'salaryExpectation', 'noticePeriod', 'workMode',
  'referralSource', 'iipaReferredBy', 'iipaMemberId',
];

const updateProfile = async (req, res) => {
  try {
    // Only update fields that were actually sent, so one page never blanks another page's fields
    const updates = {};
    for (const f of PROFILE_FIELDS) if (req.body[f] !== undefined) updates[f] = req.body[f];

    if (updates.linkedinProfile) {
      if (!isValidLinkedIn(updates.linkedinProfile))
        return res.status(400).json({ message: 'Please enter a valid LinkedIn profile URL.' });
      updates.linkedinProfile = normalizeLinkedIn(updates.linkedinProfile);
    }
    if (updates.referralSource && !REFERRAL_SOURCES.includes(updates.referralSource))
      return res.status(400).json({ message: 'Invalid referral source.' });
    if (updates.referralSource !== undefined && updates.referralSource !== 'IIPA Member') updates.iipaMemberId = null;

    await User.update(updates, { where: { id: req.user.id } });
    const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const resumeUrl = `/uploads/${req.file.filename}`;
    await User.update({ resumeUrl }, { where: { id: req.user.id } });
    res.json({ resumeUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, uploadResume };

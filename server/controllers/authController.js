const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');
const { isValidLinkedIn, normalizeLinkedIn, REFERRAL_SOURCES } = require('../utils/validators');
const { isMailConfigured, newVerifyToken, hashToken, sendVerificationEmail, VERIFY_TTL_MS } = require('../utils/mailer');

// Email verification is enforced for self-registered accounts once the mailbox is configured.
const needsVerification = (user) => isMailConfigured() && PUBLIC_ROLES.includes(user.role) && !user.emailVerified;

const issueVerification = async (user) => {
  const { token, hash, expires } = newVerifyToken();
  await user.update({ emailVerifyToken: hash, emailVerifyExpires: expires });
  await sendVerificationEmail({ to: user.email, fullName: user.fullName, token });
};

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

    if (isMailConfigured()) {
      let emailSent = true;
      try { await issueVerification(user); }
      catch (mailErr) { emailSent = false; console.error('Verification email failed:', mailErr.message); }
      return res.status(201).json({ requiresVerification: true, emailSent, email: user.email });
    }

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
    if (needsVerification(user))
      return res.status(403).json({ code: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email address before signing in. We sent you a verification link when you registered.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'emailVerifyToken', 'emailVerifyExpires'] }
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
    const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password', 'emailVerifyToken', 'emailVerifyExpires'] } });
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

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body || {};
    if (!token || typeof token !== 'string' || token.length > 200)
      return res.status(400).json({ message: 'This verification link is invalid.' });
    const user = await User.findOne({ where: { emailVerifyToken: hashToken(token) } });
    if (!user) return res.status(400).json({ message: 'This verification link is invalid or has already been used.' });
    if (!user.emailVerifyExpires || user.emailVerifyExpires < new Date())
      return res.status(400).json({ message: 'This verification link has expired. Please request a new one from the sign-in page.' });
    await user.update({ emailVerified: true, emailVerifyToken: null, emailVerifyExpires: null });
    res.json({ message: 'Your email has been verified. You can now sign in.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not verify your email right now. Please try again.' });
  }
};

// Always answers the same way, so it cannot be used to discover which emails are registered.
const resendVerification = async (req, res) => {
  const generic = { message: 'If that account exists and is not yet verified, a new verification email has been sent.' };
  try {
    const { email } = req.body || {};
    if (!email || !isMailConfigured()) return res.json(generic);
    const user = await User.findOne({ where: { email: String(email).trim() } });
    if (user && needsVerification(user)) {
      const issuedAt = user.emailVerifyExpires ? new Date(user.emailVerifyExpires).getTime() - VERIFY_TTL_MS : 0;
      if (Date.now() - issuedAt > 60 * 1000) await issueVerification(user); // at most 1 email / minute / account
    }
    res.json(generic);
  } catch (err) {
    console.error('Resend verification failed:', err.message);
    res.json(generic);
  }
};

module.exports = { register, login, getProfile, updateProfile, uploadResume, verifyEmail, resendVerification };

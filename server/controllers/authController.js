const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');

const PUBLIC_ROLES = ['seeker', 'recruiter'];

const register = async (req, res) => {
  try {
    const { fullName, email, password, role, phone, location } = req.body;
    if (!fullName || !email || !password || !role)
      return res.status(400).json({ message: 'Missing required fields' });
    if (!PUBLIC_ROLES.includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed, role, phone, location });

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

const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, location, headline, bio } = req.body;
    await User.update({ fullName, phone, location, headline, bio }, { where: { id: req.user.id } });
    const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };

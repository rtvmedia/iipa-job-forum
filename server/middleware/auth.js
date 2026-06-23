const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(req.user?.role))
    return res.status(403).json({ message: 'Access denied' });
  next();
};

module.exports = { authenticate, requireRole };

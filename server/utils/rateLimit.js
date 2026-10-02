// Minimal in-memory per-IP limiter (single Node process on this host). Enough to stop form abuse
// without adding a dependency.
const rateLimit = ({ windowMs, max, message = 'Too many requests. Please try again later.' }) => {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  }, Math.min(windowMs, 60 * 1000)).unref();

  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const rec = hits.get(key);
    if (!rec || rec.reset <= now) { hits.set(key, { count: 1, reset: now + windowMs }); return next(); }
    rec.count += 1;
    if (rec.count > max) {
      res.set('Retry-After', String(Math.ceil((rec.reset - now) / 1000)));
      return res.status(429).json({ message });
    }
    next();
  };
};

module.exports = rateLimit;

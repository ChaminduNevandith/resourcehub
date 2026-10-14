const crypto = require('crypto');
const { pool, databaseState } = require('../config/database');

async function requireAuth(req, res, next) {
  if (!databaseState.ready) return res.status(503).json({ message: 'Database is unavailable.' });
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication is required.' });

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const { rows } = await pool.query(
    'SELECT u.id, u.name, u.email, u.role, u.avatar, u.status FROM users u JOIN sessions s ON s."userId" = u.id WHERE s.token_hash = $1 AND s."expiresAt" > NOW() AND u.status = $2',
    [tokenHash, 'active'],
  );
  if (!rows[0]) return res.status(401).json({ message: 'Session is invalid or expired.' });
  req.user = rows[0];
  return next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'administrator') {
    return res.status(403).json({ message: 'Administrator access is required.' });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin };

const crypto = require('crypto');
const { pool, databaseState } = require('../config/database');

const SESSION_DAYS = 7;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, expected] = storedHash.split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

function toUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar,
    status: row.status,
  };
}

function getToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await pool.query(
    'INSERT INTO sessions (token_hash, "userId", "expiresAt") VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [tokenHash, userId],
  );
  return token;
}

async function register(req, res) {
  if (!databaseState.ready) return res.status(503).json({ message: 'Database is unavailable.' });
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  const normalizedEmail = email.trim().toLowerCase();
  const id = `u${Date.now()}`;
  const avatar = name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  try {
    const { rows } = await pool.query(
      'INSERT INTO users (id, name, email, "passwordHash", role, avatar, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, avatar, status',
      [id, name.trim(), normalizedEmail, hashPassword(password), 'employee', avatar || 'U', 'active'],
    );
    const token = await createSession(id);
    return res.status(201).json({ user: toUser(rows[0]), token });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'An account with this email already exists.' });
    throw error;
  }
}

async function login(req, res) {
  if (!databaseState.ready) return res.status(503).json({ message: 'Database is unavailable.' });
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password are required.' });

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 AND status = $2', [email.trim().toLowerCase(), 'active']);
  const user = rows[0];
  if (!user || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ message: 'Invalid email or password.' });
  if (role && user.role !== role) return res.status(403).json({ message: `This account is not an ${role} account.` });

  const token = await createSession(user.id);
  return res.json({ user: toUser(user), token });
}

async function me(req, res) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Authentication is required.' });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const { rows } = await pool.query(
    'SELECT u.* FROM users u JOIN sessions s ON s."userId" = u.id WHERE s.token_hash = $1 AND s."expiresAt" > NOW() AND u.status = $2',
    [tokenHash, 'active'],
  );
  if (!rows[0]) return res.status(401).json({ message: 'Session is invalid or expired.' });
  return res.json(toUser(rows[0]));
}

async function updateMe(req, res) {
  if (!databaseState.ready) return res.status(503).json({ message: 'Database is unavailable.' });

  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!name || !email) return res.status(400).json({ message: 'name and email are required.' });
  if (name.length > 255 || email.length > 255) return res.status(400).json({ message: 'name and email must be 255 characters or fewer.' });

  const avatar = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  try {
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4 RETURNING id, name, email, role, avatar, status',
      [name, email, avatar, req.user.id],
    );
    return res.json(toUser(rows[0]));
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'An account with this email already exists.' });
    throw error;
  }
}

async function updatePassword(req, res) {
  if (!databaseState.ready) return res.status(503).json({ message: 'Database is unavailable.' });

  const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  }

  const { rows } = await pool.query('SELECT "passwordHash" FROM users WHERE id = $1 AND status = $2', [req.user.id, 'active']);
  if (!rows[0] || !verifyPassword(currentPassword, rows[0].passwordHash)) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }
  if (verifyPassword(newPassword, rows[0].passwordHash)) {
    return res.status(400).json({ message: 'New password must be different from your current password.' });
  }

  await pool.query('UPDATE users SET "passwordHash" = $1 WHERE id = $2', [hashPassword(newPassword), req.user.id]);
  return res.status(204).send();
}

async function logout(req, res) {
  const token = getToken(req);
  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await pool.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
  }
  return res.status(204).send();
}

async function listUsers(req, res) {
  if (!databaseState.ready) return res.status(503).json({ message: 'Database is unavailable.' });
  const { rows } = await pool.query('SELECT id, name, email, role, avatar, status FROM users ORDER BY name');
  return res.json(rows.map(toUser));
}

module.exports = { register, login, me, updateMe, updatePassword, logout, listUsers };

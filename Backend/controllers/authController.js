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
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password are required.' });

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 AND status = $2', [email.trim().toLowerCase(), 'active']);
  const user = rows[0];
  if (!user || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ message: 'Invalid email or password.' });

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

module.exports = { register, login, me, logout, listUsers };

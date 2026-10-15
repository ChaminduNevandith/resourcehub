const { databaseState } = require('../config/database');

function healthCheck(req, res) {
  res.json({
    status: 'UP',
    message: 'ResourceHub backend is running',
    database: databaseState.ready ? 'connected' : 'fallback',
  });
}

module.exports = { healthCheck };

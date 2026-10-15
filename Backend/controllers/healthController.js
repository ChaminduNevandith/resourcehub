const { databaseState } = require('../config/database');

function healthCheck(req, res) {
  // Report fallback mode instead of hiding a database connection problem.
  res.json({
    status: 'UP',
    message: 'ResourceHub backend is running',
    database: databaseState.ready ? 'connected' : 'fallback',
  });
}

module.exports = { healthCheck };

const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const healthRoutes = require('./routes/healthRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Mount the API groups under a consistent versionless prefix.
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON payload.' });
  }

  return next(err);
});

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`ResourceHub backend started on port ${PORT}`);
});

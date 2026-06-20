require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { sequelize } = require('./models');

const app        = express();
const isProd     = process.env.NODE_ENV === 'production';
const clientDist = path.join(__dirname, '../client/dist');

console.log('ENV CHECK:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT:     process.env.PORT,
  DB_HOST:  process.env.DB_HOST,
  DB_NAME:  process.env.DB_NAME,
  DB_USER:  process.env.DB_USER,
  DB_PASS:  process.env.DB_PASS ? '***set***' : 'NOT SET',
});

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

// API routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/jobs',         require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/news',         require('./routes/news'));
app.use('/api/events',       require('./routes/events'));

app.get('/api/health', (_, res) => res.json({
  status: 'ok',
  time: new Date(),
  db: sequelize.config ? {
    host: sequelize.config.host,
    database: sequelize.config.database,
    username: sequelize.config.username,
  } : 'not configured',
}));

// Serve React build in production
if (isProd) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;

// Start server first, then connect DB
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected successfully.');
    return sequelize.sync();
  })
  .then(() => console.log('Tables synced.'))
  .catch(err => {
    console.error('DB connection failed:', err.message);
    // Don't exit — keep server running so we can debug
  });

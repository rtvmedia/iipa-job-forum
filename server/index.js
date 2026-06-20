require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { sequelize } = require('./models');

const app        = express();
const isProd     = process.env.NODE_ENV === 'production';
const clientDist = path.join(__dirname, '../client/dist');

// Log env on startup for debugging
console.log('ENV CHECK:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT:     process.env.PORT,
  DB_HOST:  process.env.DB_HOST,
  DB_NAME:  process.env.DB_NAME,
  DB_USER:  process.env.DB_USER,
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
  env: {
    NODE_ENV: process.env.NODE_ENV,
    DB_NAME:  process.env.DB_NAME,
    DB_USER:  process.env.DB_USER,
    DB_HOST:  process.env.DB_HOST,
  }
}));

// Serve React build in production
if (isProd) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;

sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected.');
    return sequelize.sync();
  })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => {
    console.error('DB connection failed:', err.message);
    console.error('DB config used:', {
      host: process.env.DB_HOST,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
    });
    process.exit(1);
  });

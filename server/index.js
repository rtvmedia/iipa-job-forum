require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { sequelize } = require('./models');

const app        = express();
const isProd     = process.env.NODE_ENV === 'production';
const clientDist = path.join(__dirname, '../client/dist');

app.use(cors({
  origin: isProd ? process.env.CLIENT_URL : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// API routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/jobs',         require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/news',         require('./routes/news'));
app.use('/api/events',       require('./routes/events'));
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// Serve React build in production
if (isProd) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected.');
    return sequelize.sync();
  })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('DB connection failed:', err.message); process.exit(1); });

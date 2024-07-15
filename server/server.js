const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { FavoritePair, sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API routes
app.get('/api/favoritePairs', async (req, res) => {
  const pairs = await FavoritePair.findAll();
  res.json(pairs);
});

app.post('/api/favoritePairs', async (req, res) => {
  const { baseCurrency, targetCurrency } = req.body;
  const newPair = await FavoritePair.create({ baseCurrency, targetCurrency });
  res.json(newPair);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Start server
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${port}`);
});

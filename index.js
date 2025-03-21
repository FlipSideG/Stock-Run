require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI.replace(/^"|"$/g, '');
console.log('MongoDB URI:', mongoUri);
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
  });

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

// Test route for database
app.get('/test-db', async (req, res) => {
  try {
    // Simple query to test database connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ 
      status: 'success', 
      message: 'Database connection working', 
      collections: collections.map(c => c.name) 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Start server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require('express');
const connectDB = require('./db');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Initialize middleware
app.use(express.json());

// Define routes
app.use('/logs', require('./routes/logs'));
app.use('/techs', require('./routes/techs'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend server started on port ${PORT}`));

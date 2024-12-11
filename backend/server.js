const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import auth routes
const path = require('path');  // Import path module to resolve paths
const app = express();

// Enable CORS for requests from frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend on port 3000
}));

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/yourdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Serve static files from the 'static' folder
app.use('/static', express.static(path.join(__dirname, 'static')));

// Define the root route for handling requests to '/'
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// Define the API routes
app.use('/api/auth', authRoutes); // Mount auth routes on /api/auth path

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

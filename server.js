// server.js

const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Connect to the database
const sequelize = new Sequelize('nodejs', 'root', '1718', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define the model
User.init(sequelize, Sequelize);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if password is correct
    if (user.password !== password) {
      return res.status(401).send('Invalid password');
    }

    // Successful login
    res.send('Login successful!');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create a new user
    const newUser = await User.create({ name, email, password });
    res.send('Signup successful!');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

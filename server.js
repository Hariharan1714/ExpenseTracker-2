// server.js

const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const User = require('./models/User');
const Expense = require('./models/Expense');
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
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).send('User not authorized');
    }

    // Successful login
    res.send('User login successful!');
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

const Expense = require('./models/Expense');

// Add Expense route
app.post('/add-expense', async (req, res) => {
  const { amount, description, category, userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newExpense = await Expense.create({ amount, description, category });
    await user.addExpense(newExpense); // Associate expense with user
    res.status(201).send('Expense added successfully!');
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).send('Error adding expense');
  }
});

// Delete Expense route
app.delete('/delete-expense/:userId/:expenseId', async (req, res) => {
  const { userId, expenseId } = req.params;
  try {
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).send('Expense not found');
    }

    // Check if the user owns the expense
    if (expense.userId !== userId) {
      return res.status(403).send('Unauthorized');
    }

    await expense.destroy();
    res.status(200).send('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).send('Error deleting expense');
  }
});

// Fetch Expenses route
app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).send('Error fetching expenses');
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});











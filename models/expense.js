// models/Expense.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('nodejs', 'root', '1718', {
  host: 'localhost',
  dialect: 'mysql'
});

const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Expense;

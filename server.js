const express = require('express');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
dotenv.config();

const app = express();
app.use(express.json());

// Connect to MySQL
const sequelize = new Sequelize(process.env.DB_URI);

sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Import routes
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

// Use routes
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

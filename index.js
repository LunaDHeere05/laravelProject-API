const express = require('express');
const app = express();
const PORT = 5500;
const db = require('./db');
const userService = require('./models/userModel');
const bodyParser = require('body-parser');

app.use(express.json());

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

app.get('/users', async (req, res) => {
    try {
      const users = await userService.getAllUsers(); // Get all users using the service
      res.status(200).json(users); // Send the users data as a response
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send({ message: 'Server error' });
    }
  });

app.get('/users/:id', async (req, res) => {
        const id = req.params.id; // Get the user ID from the request
        try {
          const user = await userService.getUserById(id); // Get the user by ID using the service
          if (user.length === 0) {
            res.status(404).send({ message: 'User not found' });
          } else {
            res.status(200).json(user[0]); // Send the user data as a response
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          res.status(500).send({ message: 'Server error' });
        }
});

app.post('/users', async (req, res) => {
    const data = req.body; // Get the data from the request body
    
    console.log("Data received in POST request:", req.body);
    try {
        // Call the createUser function from userService
        const newUserId = await userService.createUser(data); 
        
        // Respond with the success message and the created user's ID
        res.status(201).json({ 
            message: 'User created successfully!',
            userId: newUserId 
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: error });
    }
});

app.put('/users/:id', (req, res) => {
    const id = req.params.id; // Get the user ID from the request
    const data = req.body; // Get the data from the request body
    
    userService.updateUser(id, data) // Call the updateUser function from userService
      .then((result) => {
        if (result === 0) {
          res.status(404).send({ message: 'User not found' });
        } else {
          res.status(200).send({ message: 'User updated successfully' });
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        res.status(500).send({ message: 'Server error' });
        });
  });

app.delete('/users/:id', (req, res) => {
    const id = req.params.id; // Get the user ID from the request
    userService.deleteUser(id) // Call the deleteUser function from userService
      .then((result) => {
        if (result === 0) {
          res.status(404).send({ message: 'User not found' });
        } else {
          res.status(200).send({ message: 'User deleted successfully' });
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: 'Server error' });
      });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
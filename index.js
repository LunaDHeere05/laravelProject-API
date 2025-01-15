const express = require('express');
const app = express();
const PORT = 5500;
const db = require('./db');
const userService = require('./models/userModel');
const postService = require('./models/postModel');
const validation = require('./models/validation');

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
        const id = req.params.id;
        try {
          const user = await userService.getUserById(id);
          if (user.length === 0) {
            res.status(404).send({ message: 'User not found' });
          } else {
            res.status(200).json(user[0]);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          res.status(500).send({ message: 'Server error' });
        }
});

app.get('/users/:date_birth/:id', async (req, res) => {
  const date_birth = req.params.date_birth;
  const id = req.params.id;

  const formattedDate = new Date(date_birth).toISOString().split('T')[0];
  
  try {
      const user = await userService.getUserByIdBirth_date(formattedDate, id);
      if (user.length === 0) {
          res.status(404).send({ message: 'User not found' });
      } else {
          res.status(200).json(user[0]);
      }
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).send({ message: 'Server error' });
  }
});

app.post('/users', async (req, res) => {
  const data = req.body;
  const isNew = true;

  console.log("Data received in POST request:", req.body);
  try {
      const userValidationErrors = await validation.validateUser(data, isNew);
      if (userValidationErrors && userValidationErrors.length > 0) {
          return res.status(400).json({ errors: userValidationErrors });
      }

      const newUserId = await userService.createUser(data);
      res.status(201).json({ message: 'User created successfully!', userId: newUserId });
  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: error });
  }
});

app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const isNew = false;

  try {
      const userValidationErrors = await validation.validateUser(data, isNew);
      if (userValidationErrors && userValidationErrors.length > 0) {
          return res.status(400).json({ errors: userValidationErrors });
      }

      const result = await userService.updateUser(id, data);
      if (result === 0) {
          res.status(404).send({ message: 'User not found' });
      } else {
          res.status(200).send({ message: 'User updated successfully' });
      }
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send({ message: 'Server error' });
  }
});


app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    userService.deleteUser(id)
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

//posts


app.get('/posts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 2;
  const offset = parseInt(req.query.offset) || 0;

  try {
      const posts = await postService.getAllPosts(limit, offset);
      res.status(200).json(posts);
  } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).send({ message: 'Server error' });
  }
});

app.get('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const post = await postService.getPostById(id);
      if (post.length === 0) {
          res.status(404).send({ message: 'Post not found' });
      } else {
          res.status(200).json(post[0]);
      }
  } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).send({ message: 'Server error' });
  }
});

app.post('/posts', async (req, res) => {
  const data = req.body;
  const isNew = true;

  try {
      const postValidationErrors = await validation.validatePost(data, isNew);
      if (postValidationErrors && postValidationErrors.length > 0) {
          return res.status(400).json({ errors: postValidationErrors });
      }

      const newPostId = await postService.createPost(data);
      res.status(201).json({ message: 'Post created successfully!', postId: newPostId });
  } catch (error) {
      console.error("Error creating post aiaiaiaiai:", error);
      res.status(500).json({ message: error });
  }
});


app.put('/posts/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const isNew = false;

  try {
      const postValidationErrors = await validation.validatePost(data, isNew);
      if (postValidationErrors && postValidationErrors.length > 0) {
          return res.status(400).json({ errors: postValidationErrors });
      }

      const result = await postService.updatePost(id, data);
      if (result === 0) {
          res.status(404).send({ message: 'Post not found' });
      } else {
          res.status(200).send({ message: 'Post updated successfully' });
      }
  } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).send({ message: 'Server error' });
  }
});


app.delete('/posts/:id', (req, res) => {
  const id = req.params.id;
  postService.deletePost(id)
      .then((result) => {
          if (result === 0) {
              res.status(404).send({ message: 'Post not found' });
          } else {
              res.status(200).send({ message: 'Post deleted successfully' });
          }
      })
      .catch((error) => {
          console.error("Error deleting post:", error);
          res.status(500).send({ message: 'Server error' });
      });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
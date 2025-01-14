const express = require('express');
const Post = require('../models/post');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
});

// Create a new post
router.post('/', async (req, res) => {
  const newPost = await Post.create(req.body);
  res.status(201).json(newPost);
});

module.exports = router;

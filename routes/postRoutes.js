const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


// GET request for list of all posts.
router.get('/posts', postController.getPosts);

module.exports = router;
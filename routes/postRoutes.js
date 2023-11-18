const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


router.get('/', postController.getPosts);
router.post('/edit-post', postController.editPost);
router.post('/delete-post', postController.deletePost);
router.post('/create-post', postController.createPost);
router.get('/post', postController.getPost);
router.post('/upvote', postController.upvote);
router.post('/downvote', postController.downvote);



module.exports = router;
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.get('/', commentController.getComments);
router.post('/edit-post', commentController.editComment);
router.post('/delete-post', commentController.deleteComment);
router.post('/create-comment', commentController.createComment);
router.get('/post', commentController.getComment);



module.exports = router;
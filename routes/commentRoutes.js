/* This code is creating a router object using the Express framework in JavaScript. */
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.get('/', commentController.getComments);
router.post('/edit-comment', commentController.editComment);
router.post('/delete-comment', commentController.deleteComment);
router.post('/create-comment', commentController.createComment);
router.get('/comment', commentController.getComment);



module.exports = router;
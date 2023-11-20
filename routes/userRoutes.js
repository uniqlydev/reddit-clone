/* This code is setting up a router for handling different routes in a Node.js application using the
Express framework. */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const session = require('express-session');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/profile-edit',userController.editProfile);



module.exports = router;
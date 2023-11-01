const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const user = require('../models/user');

router.route('/users/:id').get(function (req, res) {
    user.findById(req.params.id).then((user) => {
        res.json(user);
        res.end();
    });
});

router.route('/users').get(function (req, res) {
    user.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

router.route('/add-user').post(function (req, res) {
    const user = new user({
        username: req.body.username,
        bio: req.body.bio,
        memberSince: req.body.memberSince,
        bday: req.body.bday,
        memberURL: req.body.memberURL,
        avatar: req.body.avatar,
        karma: req.body.karma,
    });
    user.save();
    res.json({ message: 'User created!' });
});

// Define routes 
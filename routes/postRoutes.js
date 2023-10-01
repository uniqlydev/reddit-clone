const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Define routes
router.get('/', (req, res) => {
    res.render('post/post', {
        subreddits: [

            // These are test data to simulate dynamics
            {
                heading: "Taylor Swift and Travis Scott",
                subheading: "Taylor Swift and Travis Scott are dating!",
                subreddit : "/fauxmau",
            },
            {
                heading: "F1 2021 Season won't push through",
                subheading: "F1 2021 Season won't push through due to COVID-19",
                subreddit : "/formula1",
            }
        ],
    });
});

module.exports = router;
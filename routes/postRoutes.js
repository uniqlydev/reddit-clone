const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Define routes
router.get('/', (req, res) => {
    res.render('post/post', {
        post_details: {
            subreddit: "r/nba",
            post_id: 1,
            title: "[Wojnarowski] BREAKING: The Portland Trail Blazers are trading guard Damian Lillard to the Milwaukee Bucks, sources tell ESPN. ",
            content: {
                type: "link",
                url: "twitter.com"
            },
            date_posted: "2023-10-11",
            author: "CCAPDEV-sample",
            votes: 25000
        },
        comments: [
            // These are test data to simulate dynamics
            {
                id: 1,
                // reply_id: null, // reply id for phase 2
                content: {
                    commenter: "Number1GiannisFan",
                    created_date: "2023-10-11",
                    votes:25,
                    text: "As a fan of both, I'm excited to see this pairing!"
                },
                children_id: [2]
            },
            {
                id: 2,
                // reply_id: 1,
                content: {
                    commenter: "Number2GiannisFan",
                    created_date: "2023-10-11",
                    votes:12,
                    text: "I don't even need to watch, just give them the trophy already!"
                },
                children_id: []
            }
        ],
    });
});

module.exports = router;
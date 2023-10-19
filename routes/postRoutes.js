const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Define routes
router.get('/', (req, res) => {
    res.render('post/post', {
        post_details: {
            subreddit: "nba",
            post_id: 1,
            title: "[Wojnarowski] BREAKING: The Portland Trail Blazers are trading guard Damian Lillard to the Milwaukee Bucks, sources tell ESPN. ",
            content: {
                type: "text",
                text: "Link: https://twitter.com/wojespn/status/1707096933708509295?lang=en<br><br>After an offseason-long fiasco with the Portland Trailblazers, Damian Lillard has been traded to the Milwaukee Bucks in a blockbuster 3-Team trade with the Phoenix Suns. How do you feel about this trade?"
            },
            date_posted: "2023-10-11",
            author: "DataSciencePro",
            votes: 2500
        },
        comments: [
            // These are test data to simulate dynamics
                {
                    id: 1,
                    // reply_id: null, // reply id for phase 2
                    content: {
                        commenter: "TechEnthusiast21",
                        created_date: "2023-10-11",
                        votes:25,
                        text: "As a fan of both, I'm excited to see this pairing!"
                    },
                    children: [
                        {
                            id: 2,
                            content: {
                                commenter: "WebDevWizard",
                                created_date: "2023-10-11",
                                votes:12,
                                text: "I don't even need to watch, just give them the trophy already!"
                            },
                            children: [
                                {
                                    id: 2,
                                    content: {
                                        commenter: "DataSciencePro",
                                        created_date: "2023-10-11",
                                        votes:6,
                                        text: "I agree! We will be witnessing greatness in the levels of Shaq and Kobe!"
                                    },
                                    children: []
                                }
                            ]
                        },
                    ]
                },
            {
                id: 2,
                content: {
                    commenter: "CodeLearner42",
                    created_date: "2023-10-12",
                    votes:5,
                    text: "I don't care, I know that Jimmy will still make them exit the first round next year!"
                },
                children: [
                    {
                        id: 2,
                        content: {
                            commenter: "WebDevWizard",
                            created_date: "2023-10-11",
                            votes:7,
                            text: "Ok"
                        },
                        children: []
                    }
                ]
            }
        ],
    });
});

module.exports = router;
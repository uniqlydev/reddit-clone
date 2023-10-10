const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');


const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/api',userRoutes);
// app.use('/api',postRoutes);

require('dotenv').config();
const port = process.env.PORT || 8080;


// Will serve as the homepage
app.get('/', (req, res) => {
    res.render('home/home', {
        subreddits: [

            // These are test data to simulate dynamics
            {
                heading: "Taylor Swift and...",
                subheading: "Taylor Swift and Travis Scott are dating!",
                subreddit : "/fauxmau",
            },
            {
                heading: "F1 2021 Season..",
                subheading: "F1 2021 Season won't push through due..",
                subreddit : "/formula1",
            },
            {
                heading: "F1 2021 Season..",
                subheading: "F1 2021 Season won't push through due..",
                subreddit : "/formula1",
            }
        ],

        posts: [
            {
                title: "What's your expensive hobby?",
                subreddit: "r/Philippines",
                description: "I'm doing scuba diving and it cost me like 2k per dive. I want to see ano ang pinaka expensive na hobby nating adults!",
                upvotes: "20",
                comments: "10",
                downvotes: "5",
            },
            {
                title: "Favorite Travel Destinations",
                subreddit: "r/Travel",
                description: "Share your favorite travel destinations and why you love them.",
                upvotes: "35",
                comments: "15",
                downvotes: "7",
            },
            {
                title: "Cooking Enthusiasts Unite!",
                subreddit: "r/Food",
                description: "Discuss your favorite recipes, cooking tips, and culinary adventures.",
                upvotes: "28",
                comments: "12",
                downvotes: "3",
            },
            // Add more test data objects here
        ]
        
    });
});

// Profile page
app.get('/profile', (req, res) => {
    res.render('home/profile', {
        profile: [
            {
                id: 100,
                username: "machew",
                bio: "i am machew",
                avatar: "avatar here",
                karma: 1
            }
        ],
    });
});

// Profile Edit page
app.get('/profile-edit', (req, res) => {
    res.render('home/profileEdit', {
        profile: [
            {
                id: 100,
                username: "machew",
                bio: "i am machew",
                avatar: "avatar here",
                karma: 1
            }
        ],
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
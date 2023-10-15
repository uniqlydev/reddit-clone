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

    const posts = [
        {
            title: "What's your expensive hobby?",
            subreddit: "r/Philippines",
            description: "I'm doing scuba diving and it cost me like 2k per dive. I want to see ano ang pinaka expensive na hobby nating adults!",
            body: "test",
            upvotes: "20",
            comments: "10",
            downvotes: "5",
        },
        {
            title: "Favorite Travel Destinations",
            subreddit: "r/Travel",
            description: "Share your favorite travel destinations and why you love them.",
            body: "test",
            upvotes: "35",
            comments: "15",
            downvotes: "7",
        },
        {
            title: "Cooking Enthusiasts Unite!",
            subreddit: "r/Food",
            description: "Discuss your favorite recipes, cooking tips, and culinary adventures.",
            body: "test",
            upvotes: "28",
            comments: "12",
            downvotes: "3",
        }
        // Add more test data objects here
    ];

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
            },
            {
                heading: "New Breakthrough in Medicine",
                subheading: "Scientists make a groundbreaking discovery in the fight against cancer.",
                subreddit: "/science",
            },
            {
                heading: "SpaceX Launches Mars Mission",
                subheading: "Elon Musk's SpaceX successfully launches a mission to Mars.",
                subreddit: "/space",
            },
            {
                heading: "Tech News",
                subheading: "Apple unveils its latest iPhone with revolutionary features.",
                subreddit: "/technology",
            },
            {
                heading: "World Cup 2022 Update",
                subheading: "Exciting matches and surprises in the ongoing World Cup.",
                subreddit: "/sports",
            },
            {
                heading: "Environmental Awareness",
                subheading: "A campaign to protect endangered species gains momentum.",
                subreddit: "/environment",
            },
            {
                heading: "New Movie Release",
                subheading: "Critics rave about the latest blockbuster hitting theaters.",
                subreddit: "/movies",
            },
            {
                heading: "Cooking Tips",
                subheading: "Learn the secret to making the perfect pizza at home.",
                subreddit: "/food",
            },
            {
                heading: "Book Recommendations",
                subheading: "Best-sellers and must-reads for book lovers.",
                subreddit: "/books",
            }
            
        ], 
        posts: posts,
        postLength: posts.length

    });
});


// You can add more test data here (I'm just waiting for the login)
const getUserDataByUsername = (username) => {
    const user = [
        {
          id: 101,
          username: "TechEnthusiast21",
          bio: "Passionate about all things tech!",
          memberSince: "2y",
          bday: "January 10, 2020",
          memberURL: "u/TechEnthusiast21",
          avatar: "avatar1.jpg",
          karma: 10
        },
        {
          id: 102,
          username: "WebDevWizard",
          bio: "Creating amazing web experiences.",
          memberSince: "3y",
          bday: "March 15, 2019",
          memberURL: "u/WebDevWizard",
          avatar: "avatar2.jpg",
          karma: 5
        },
        {
          id: 103,
          username: "DataSciencePro",
          bio: "Exploring data science and AI wonders.",
          memberSince: "1y",
          bday: "June 30, 2021",
          memberURL: "u/DataSciencePro",
          avatar: "avatar3.jpg",
          karma: 20
        },
        {
          id: 104,
          username: "CodeLearner42",
          bio: "On a journey to master coding.",
          memberSince: "4y",
          bday: "December 5, 2018",
          memberURL: "u/CodeLearner42",
          avatar: "avatar4.jpg",
          karma: 8
        }
      ]
      
        return user.filter((user) => {
            return user.username == username;
        });
}


app.get('/profile', (req, res) => {
    const username = req.query.username; 
    const user = getUserDataByUsername(username); 


    console.log(user[0].bio)

    res.render('home/profile', {
        profile: user, 
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
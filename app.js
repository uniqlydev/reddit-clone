const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const database = require('./database/database.js');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const session = require('express-session');

const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/user',userRoutes);
app.use('/api',postRoutes);

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
}));

const port = process.env.PORT || 8080;



// Will serve as the homepage
app.get('/', async (req, res) => {
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    try {
        const response = await fetch('http://localhost:'+ port + '/api/posts');
        const postsList = await response.json();

        res.render('home/home', {
            postsList: postsList,
            postLength: postsList.length
        });
    }catch(e) {
        res.status(500).json({ message: e.message });
    }

    
});

// Go to specific users page
app.get('/profile', async (req, res) => {
    const urlParams = new URLSearchParams(req.query);
    const username = urlParams.get('username');
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const users = db.collection('users');
    const posts = db.collection('posts');
    const user = await users.findOne({ username });
    const userPosts = await posts.find({ user: "u/" + username }).sort({ id: -1 }).toArray();

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.render('home/profile', {
        user: user,
        postsList: userPosts,
    });
});

// Profile Edit page
app.get('/profile-edit', (req, res) => {
    res.render('home/profileEdit', {
    });
});

// Login Page
app.get('/login', async (req, res) => {
    res.render('home/login', {
    });
});

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const client = new MongoClient(process.env.DB_CONN);
//     const db = client.db(process.env.DB_NAME);
//     const users = db.collection('users');
//     const userLogin = await users.findOne({ username });

//     if (!userLogin) {
//         res.status(401).json({ message: "Invalid credentials!" });
//         return;
//     }

//     const passwordMatch = await bcrypt.compare(password, userLogin.password);

//     if (passwordMatch) {
//         if (req.session.authenticated) {
//             res.status(201).json(req.session.user.username);
//         } else {
//             req.session.authenticated = true;
//             req.session.user = {
//                 username, password
//             };
//             res.status(201).json(req.session.user.username);
//         }
//     } else {
//         res.status(401).json({ message: "Invalid credentials!" });
//     }
// });

// Register Page
app.get('/register', (req, res) => {
    res.render('home/register', {
    });
});

// app.post('/register', async (req, res) => {
//     const { username, password, confirmPassword } = req.body;
//     const client = new MongoClient(process.env.DB_CONN);
//     const db = client.db(process.env.DB_NAME);
//     const users = db.collection('users');
//     const existingUser = await users.findOne({ username });

//     if (password !== confirmPassword) {
//         res.status(400).json({ message: "Passwords do not match!" });
//         return;
//     }

//     if (existingUser) {
//         res.status(400).json({ message: "Username is already taken!" });
//         return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const userData = {
//         username,
//         password: hashedPassword,
//         bio: '',
//         memberURL: 'u/' + username,
//         avatar: '',
//     }

//     await users.insertOne(userData);

//     res.json({ message: "Registration successful" });
// });


// Create Post Page
app.get('/create-post', (req, res) => {
    res.render('post/createPost', {
    });
});

app.post('/create-post', async (req, res) => {
    const { title, body } = req.body;
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const posts = db.collection('posts');

    if (title === '' || body === '') {
        res.status(400).json({ message: "Please fill out all fields!" });
        return;
    }

    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const highestId = await posts.find().sort({ id: -1 }).limit(1).toArray();
    const id = highestId.length === 0 ? 1 : highestId[0].id + 1;

    const postData = {
        id,
        title,
        body,
        upvotes: 0,
        comments: 0,
        downvotes: 0,
        user: "u/username",
        date: date,
    }

    await posts.insertOne(postData);

    res.json({ message: "Post created" });
});

app.get('/posts', (req, res) => {
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



// Connect to Cloud MongoDB
database.connectToMongoDB();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
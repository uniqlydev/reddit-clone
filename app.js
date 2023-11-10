const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const axios = require('axios'); 
const {client, connectToMongoDB, DB_NAME} = require('./database/database.js');
const cors = require('cors');
const session = require('express-session');
const mongoStore = require('connect-mongo');

const app = express();
app.use(express.json());

require('dotenv').config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect first before routing
connectToMongoDB();

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.DB_CONN, // replace with your MongoDB connection string
        ttl: 14 * 24 * 60 * 60, // session TTL in seconds
    }),
}));


app.use('/api/user',userRoutes);
app.use('/api/posts',postRoutes);


const port = process.env.PORT;

// Will serve as the homepage
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:${port}/api/posts`);
        const postsList = response.data;
        const authenticated = req.session.authenticated;
        const username = req.session.username;

        console.log(req.session);

        res.render('home/home', {
            postsList,
            postLength: postsList.length,
            authenticated,
            username,
            karma:1,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Go to specific users page

app.get('/profile', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const username = urlParams.get('username');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const posts = db.collection('posts');

        const user = await users.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const userPosts = await posts.find({ user: "u/" + username }).sort({ id: -1 }).toArray();
        const authenticated = req.session.authenticated;

        res.render('home/profile', {
            username,
            authenticated,
            karma:1,
            user,
            postsList: userPosts,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Profile Edit page
app.get('/profile-edit', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const username = urlParams.get('username');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const users = db.collection('users');

        const user = await users.findOne({ username });

        res.render('home/profileEdit', {
            user,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Login Page
app.get('/login', (req, res) => {
    res.render('home/login', {
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.redirect('/');
        }
    });
});


// Register Page
app.get('/register', (req, res) => {
    res.render('home/register', {
    });
});

// Create Post Page
app.get('/create-post', (req, res) => {
    const authenticated = req.session.authenticated;
    const username = req.session.username;

    if (authenticated === true) {
        res.render('post/createPost', {
            authenticated,
            username,
            karma:1,
        });
    }else {
        res.redirect('/login');
    }
});

app.get('/edit-post', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const id = urlParams.get('id');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');

        const post = await posts.findOne({ id: parseInt(id) });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const authenticated = req.session.authenticated;
        const username = req.session.username;

        res.render('post/editPost', {
            authenticated,
            username,
            karma:1,
            post,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const id = urlParams.get('id');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');

        const post = await posts.findOne({ id: parseInt(id) });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const username = post.user.substring(2);

        res.render('post/post', {
            post,
            username,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
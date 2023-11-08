const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const {client, connectToMongoDB, DB_NAME} = require('./database/database.js');
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

// Connect first before routing
connectToMongoDB();

app.use('/api/user',userRoutes);
app.use('/api/posts',postRoutes);

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

const port = process.env.PORT;

// Will serve as the homepage
app.get('/', async (req, res) => {
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
app.get('/profile-edit', async (req, res) => {
    const urlParams = new URLSearchParams(req.query);
    const username = urlParams.get('username');
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const users = db.collection('users');
    const user = await users.findOne({ username });

    res.render('home/profileEdit', {
        user: user,
    });
});

// Login Page
app.get('/login', (req, res) => {
    res.render('home/login', {
    });
});

// Register Page
app.get('/register', (req, res) => {
    res.render('home/register', {
    });
});

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
        edited: false,
    }

    await posts.insertOne(postData);

    res.json({ message: "Post created" });
});

app.get('/edit-post', async (req, res) => {
    const urlParams = new URLSearchParams(req.query);
    const id = urlParams.get('id');
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const posts = db.collection('posts');
    const post = await posts.findOne({ id: parseInt(id) });

    if (!post) {
        res.status(404).json({ message: "Post not found" });
    }

    res.render('post/editPost', {
        post: post,
    });
});

app.get('/posts', async (req, res) => {
    const urlParams = new URLSearchParams(req.query);
    const id = urlParams.get('id');
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const posts = db.collection('posts');
    const post = await posts.findOne({ id: parseInt(id) });

    if (!post) {
        res.status(404).json({ message: "Post not found" });
    }

    const username = post.user.substring(2);

    res.render('post/post', {
        post: post,
        username: username,
    });
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
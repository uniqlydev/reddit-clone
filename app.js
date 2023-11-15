const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const axios = require('axios'); 
const {client, connectToMongoDB, DB_NAME} = require('./database/database.js');
const cors = require('cors');
const session = require('express-session');

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

app.use('/api/user',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);

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
        const response = await axios.get(`http://localhost:${port}/api/posts`);
        const postsList = response.data;

        res.render('home/home', {
            postsList,
            postLength: postsList.length
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

        res.render('home/profile', {
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

        res.render('post/editPost', {
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

        const username = post.user.substring(2)

        // Generate commments
        const commentCursor = db.collection('comments');
        const comments = await commentCursor.find({postId: parseInt(id)})
            .toArray(function (err, result) {
                if (err) throw err
                console.log(result)
            });

        res.render('post/post', {
            post,
            username,
            comments
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.get('/search', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const query = urlParams.get('query');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');

        // Get all posts containing the query string in either the title or body
        const postsList = await posts.find({ $or: [{ title: { $regex: query, $options: 'i' } }, { body: { $regex: query, $options: 'i' } }] }).sort({ id: -1 }).toArray();

        res.render('home/search', {
            postsList,
            query,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
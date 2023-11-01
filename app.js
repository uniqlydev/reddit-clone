const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const database = require('./database/database.js');
const user = require('./models/user');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// database.setupAndRetrieveRecords();

// app.use('/api',userRoutes);
app.use('/posts',postRoutes);

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
        }
    ];

    res.render('home/home', {
        posts: posts,
        postLength: posts.length

    });
});


app.get('/profile', (req, res) => {
    res.render('home/profile', {
        profile: user, 
    });
});

// Profile Edit page
app.get('/profile-edit', (req, res) => {
    res.render('home/profileEdit', {
        profile: user,
    });
});

// Login Page
app.get('/login', async (req, res) => {
    res.render('home/login', {
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const users = db.collection('users');
    const userLogin = await users.findOne({ username });

    if (!userLogin) {
        res.status(401).json({ message: "Invalid credentials!" });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, userLogin.password);

    if (passwordMatch) {
        res.json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials!" });
    }
});

// Register Page
app.get('/register', (req, res) => {
    res.render('home/register', {
    });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const users = db.collection('users');
    const existingUser = await users.findOne({ username });

    if (existingUser) {
        res.status(400).json({ message: "Username is already taken!" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        username,
        password: hashedPassword,
        bio: '',
        memberURL: 'u/' + username,
        avatar: '',
    }

    await users.insertOne(userData);

    res.json({ message: "Registration successful" });
});

// Create Post Page
app.get('/create-post', (req, res) => {
    res.render('post/createPost', {
    });
});

database.connectToMongoDB();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
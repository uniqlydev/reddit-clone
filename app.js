const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const database = require('./database/database.js');
const user = require('./models/user');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const cors = require('cors');
const postModel = require('./models/post');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api',userRoutes);
app.use('/posts',postRoutes);

require('dotenv').config();
const port = process.env.PORT || 8080;

// Will serve as the homepage

app.get('/', async (req, res) => {

    /* 
        Please check this code for displaying data taken from database.
        It is not working. I think it is because of the async function.
        Working code is commented below this code.
    */

    const posts = await postModel.find().sort({ id: -1 }).limit(10).exec();
    res.render('home/home', {
        postsList: posts,
        postLength: posts.length
    });
});

// app.get('/', (req, res) => {
//     const post = [
//         {
//             title: "What's your expensive hobby?",
//             body: "I'm doing scuba diving and it cost me like 2k per dive. I want to see ano ang pinaka expensive na hobby nating adults!",
//             upvotes: "200",
//             comments: "10",
//             downvotes: "5",
//             user: "u/username",
//             date: "2021-02-01"
//         }
//     ];

//     res.render('home/home', {
//         postsList: post,
//         postLength: post.length

//     });
// });


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
    const { username, password, confirmPassword } = req.body;
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const users = db.collection('users');
    const existingUser = await users.findOne({ username });

    if (password !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match!" });
        return;
    }

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

// Connect to Cloud MongoDB
database.connectToMongoDB();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
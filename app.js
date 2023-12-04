const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const axios = require('axios'); 
const {client, connectToMongoDB, DB_NAME} = require('./models/database.js');
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
app.use('/api/comments',commentRoutes);


const port = process.env.PORT;


/* The above code is defining a route handler for the root URL ("/") in an Express.js application. */
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:${port}/api/posts`);
        const postsList = response.data;
        const authenticated = req.session.authenticated;
        const username = req.session.username;
        const loggedUser = req.session.username;

        // Get avatar from users from postsList
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const avatars = [];
        for (let i = 0; i < postsList.length; i++) {
            const user = await users.findOne({ username: postsList[i].user.substring(2) });
            avatars.push(user.avatar);
        }

        console.log(authenticated);

        let avatar = null;
        // If logged in, get avatar from logged user
        if (authenticated === true) {
            const loggedUseravatar = await users.findOne({ username: loggedUser });
            avatar = loggedUseravatar.avatar;
        }else {
            avatar = "";
        }

        res.render('home/home', {
            postsList,
            postsLength: postsList.length,
            authenticated,
            username,
            loggedUser,
            avatars,
            avatar
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


app.get('/about', async (req,res) => {
    const authenticated = req.session.authenticated;
    const loggedUser = req.session.username;

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    let avatar = "";

    if (authenticated === true) {
        const loggedUseravatar = await users.findOne({ username: loggedUser });
        avatar = loggedUseravatar.avatar;
    }

    res.render('home/about', {
        authenticated,
        loggedUser,
        avatar
    });
})

/* The above code is defining a route handler for the '/profile' endpoint in a Node.js Express
application. When a GET request is made to this endpoint, the code performs the following actions: */
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
        const loggedUser = req.session.username;

        // const loggeduseravatar = await users.findOne({ username: loggedUser });
        let avatar = "";

        if (authenticated === true) {
            const loggedUseravatar = await users.findOne({ username: loggedUser });
            avatar = loggedUseravatar.avatar;
        }

        


        res.render('home/profile', {
            username,
            authenticated,
            loggedUser,
            user,
            postsList: userPosts,
            avatar,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


/* The above code is defining a route handler for the '/profile-edit' endpoint. When a GET request is
made to this endpoint, the code performs the following actions: */
app.get('/profile-edit', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const username = urlParams.get('username');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const users = db.collection('users');

        const user = await users.findOne({ username });
        const loggedUser = req.session.username;
        const authenticated = req.session.authenticated;

        let avatar = "";

        if (authenticated === true) {
            const loggedUseravatar = await users.findOne({ username: loggedUser });
            avatar = loggedUseravatar.avatar;
        }


        if (loggedUser !== username) {
            res.redirect('/profile?username=' + username);
            return;
        }

        res.render('home/profileEdit', {
            user,
            authenticated,
            loggedUser,
            avatar
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


/* The code `app.get('/login', (req, res) => {
    res.render('home/login', {
    });
});` is defining a route handler for the '/login' endpoint in an Express.js application. When a GET
request is made to this endpoint, the code renders the 'home/login' view and sends it as a response.
This allows the user to access the login page of the application. */
app.get('/login', (req, res) => {
    res.render('home/login', {
    });
});

/* The above code is defining a route for the "/logout" endpoint in a Node.js application. When a GET
request is made to this endpoint, it destroys the session associated with the request. If there is
an error while destroying the session, it logs the error and sends a response with a status code of
500 and a JSON object containing a message indicating an internal server error. If the session is
successfully destroyed, it redirects the user to the root ("/") endpoint. */
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

/* The code `app.get('/register', (req, res) => {
    res.render('home/register', {
    });
});` is defining a route handler for the '/register' endpoint in an Express.js application. When a
GET request is made to this endpoint, the code renders the 'home/register' view and sends it as a
response. This allows the user to access the registration page of the application. */
app.get('/register', (req, res) => {
    res.render('home/register', {
    });
});


/* The above code is defining a route handler for the '/create-post' endpoint. */
app.get('/create-post', async (req, res) => {
    const authenticated = req.session.authenticated;
    const username = req.session.username;
    const loggedUser = req.session.username;

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    let avatar = "";

    if (authenticated === true) {
        const loggedUseravatar = await users.findOne({ username: loggedUser });
        avatar = loggedUseravatar.avatar;
    }



    if (authenticated === true) {
        res.render('post/createpost', {
            authenticated,
            username,
            loggedUser,
            avatar,
        });
    }else {
        res.redirect('/login');
    }
});

/* The above code is defining a route handler for the '/edit-post' endpoint. When a GET request is made
to this endpoint, the code performs the following steps: */
app.get('/edit-post', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const id = urlParams.get('id');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');
        const users = db.collection('users');

        const post = await posts.findOne({ id: parseInt(id) });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const userPoster = post.user.substring(2);

        const authenticated = req.session.authenticated;
        const username = req.session.username;
        const loggedUser = req.session.username;

        if (loggedUser !== userPoster) {
            res.redirect('/posts?id=' + id);
            return;
        }

        let avatar = "";

        if (authenticated === true) {
            const loggedUseravatar = await users.findOne({ username: loggedUser });
            avatar = loggedUseravatar.avatar;
        }

        res.render('post/editpost', {
            authenticated,
            username,
            loggedUser,
            post,
            avatar
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

/* The above code is defining a route handler for the '/posts' endpoint. When a GET request is made to
this endpoint, the code performs the following steps: */
app.get('/posts', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const id = urlParams.get('id');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');

        const post = await posts.findOne({ id: parseInt(id) });

        let upvoted = false;
        let downvoted = false;

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

        console.log(comments)
        const authenticated = req.session.authenticated;
        const loggedUser = req.session.username;

        // Get avatar from user
        const users = db.collection('users');
        const user = await users.findOne({ username });
        const poster_avatar = user.avatar;

        // Get avatar from logged user
        let avatar = "";

        if (authenticated === true) {
            const loggedUseravatar = await users.findOne({ username: loggedUser });

            const user = await users.findOne({ username: loggedUser });

            avatar = loggedUseravatar.avatar;

            // Check is user has liked or disliked post based on postID
            if (user.likedPosts.includes(id)) {
                upvoted = true;
            }

            if (user.dislikedPosts.includes(id)) {
                downvoted = true;
            }
        }


        res.render('post/post', {
            post,
            username,
            comments,
            authenticated,
            loggedUser,
            poster_avatar,
            avatar,
            upvoted,
            downvoted
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

/* The above code is defining a route handler for the '/search' endpoint in a Node.js Express
application. When a GET request is made to this endpoint, the code performs the following steps: */
app.get('/search', async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const query = urlParams.get('query');

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');

        // Get all posts containing the query string in either the title or body
        const postsList = await posts.find({ $or: [{ title: { $regex: query, $options: 'i' } }, { body: { $regex: query, $options: 'i' } }] }).sort({ id: -1 }).toArray();

        const authenticated = req.session.authenticated;
        const loggedUser = req.session.username;

        const users = db.collection('users');
        const avatars = [];
        for (let i = 0; i < postsList.length; i++) {
            const user = await users.findOne({ username: postsList[i].user.substring(2) });
            avatars.push(user.avatar);
        }

        let avatar = "";

        if (authenticated === true) {
            const loggedUseravatar = await users.findOne({ username: loggedUser });
            avatar = loggedUseravatar.avatar;
        }

        res.render('home/search', {
            postsList,
            postsLength: postsList.length,
            query,
            authenticated,
            loggedUser,
            avatars,
            avatar,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

/* The above code is starting a server and listening for incoming requests on the specified port. Once
the server is started, it will log a message to the console indicating the port on which the server
is running. */
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

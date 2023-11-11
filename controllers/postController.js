const Post = require('../models/post');
const {client, DB_NAME} = require('../database/database');

// GET request for list of all posts.
exports.getPosts = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');
        const postList = await posts.find().sort({ id: -1 }).toArray();
        res.json(postList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
// POST request for editing a post.
exports.editPost = async (req, res) => {
    const { postId, title, body } = req.body;

    try {
        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');

        if (title === '' || body === '') {
            res.status(400).json({ message: "Please fill out all fields!" });
            return;
        }

        await posts.updateOne(
            { id: parseInt(postId) },
            { $set: { title, body, edited: true } }
        );

        res.json({ message: "Post edited" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
// GET request for a single post.
exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');
        const post = await posts.findOne({ id: parseInt(id) });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// POST request for creating a post.
exports.createPost = async (req, res) => {
    const { title, body } = req.body;
    const db = client.db(DB_NAME);
    const posts = db.collection('posts');

    if (!req.session.authenticated) {
        res.status(401).json({ message: "You must be logged in to create a post!" });
        return;
    }

    try {
        if (title === '' || body === '') {
            res.status(400).json({ message: "Please fill out all fields!" });
            return;
        }

        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const highestId = await posts.find().sort({ id: -1 }).limit(1).toArray();
        const id = highestId.length === 0 ? 1 : highestId[0].id + 1;

        // Create a new Post document using the Mongoose model
        const newPost = new Post({
            id,
            title,
            body,
            upvotes: 0,
            comments: 0,
            downvotes: 0,
            user: "u/" + req.session.username, // No idea how yet
            date: date,
            edited: false,
        });

        // Save the new post to the database
        await posts.insertOne(newPost);

        res.json({ message: "Post created" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// POST request for deleting a post.
exports.deletePost = async (req, res) => {
    const { postId } = req.body;

    try {
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');
        const post = await posts.findOne({ id: parseInt(postId) });

        const userPoster = post.user.substring(2);
        const loggedUser = req.session.username;

        if (loggedUser !== userPoster) {
            res.status(401).json({ message: "You can't delete someone else's post!" });
            return;
        }

        await posts.deleteOne({ id: parseInt(postId) });

        res.json({ message: "Post deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.upvote = async (req, res) => {
    const { postId,voteCount } = req.body;

    try {
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');
        const post = await posts.findOne({ id: parseInt(postId) });

        await posts.updateOne(
            { id: parseInt(postId) },
            { $set: { upvotes: parseInt(voteCount) } }
        );

        res.json({ message: "Post edited" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

exports.downvote = async (req, res) => {
    const { postId,voteCount } = req.body;

    try {
        const db = client.db(DB_NAME);
        const posts = db.collection('posts');
        const post = await posts.findOne({ id: parseInt(postId) });

        await posts.updateOne(
            { id: parseInt(postId) },
            { $set: { downvotes: parseInt(voteCount) } }
        );

        res.json({ message: "Post edited" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
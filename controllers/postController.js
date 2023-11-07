const post = require('../models/post');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

// GET request for list of all posts.
exports.getPosts = async (req, res) => {
    try {
        const client = new MongoClient(process.env.DB_CONN);
        const db = client.db(process.env.DB_NAME);
        const posts = await db.collection('posts');
        const postList = await posts.find().toArray();
        res.json(postList);
    }catch(e) {
        res.status(500).json({ message: e.message });
    }
};
// POST request for editing a post.
exports.editPost = async (req,res) => {
    const { postId, title, body } = req.body;
    const client = new MongoClient(process.env.DB_CONN);
    const db = client.db(process.env.DB_NAME);
    const posts = db.collection('posts');

    if (title === '' || body === '') {
        res.status(400).json({ message: "Please fill out all fields!" });
        return;
    }

    await posts.updateOne(
        {id: parseInt(postId)},
        { $set: { title: title, body: body, edited: true } }
    );

    res.json({ message: "Post edited" });
}
// GET request for a single post.
exports.getPost = async (req, res) => {
    try {
        const urlParams = new URLSearchParams(req.query);
        const id = urlParams.get('id');
        const client = new MongoClient(process.env.DB_CONN);
        const db = client.db(process.env.DB_NAME);
        const posts = db.collection('posts');
        const post = await posts.findOne({ id: parseInt(id) });
        res.json(post);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
// POST request for creating a post.
exports.createPost = async (req, res) => {
    try {
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
            user: "u/username", // No idea how yet
            date: date,
            edited: false,
        }

        await posts.insertOne(postData);

        res.json({ message: "Post created" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// POST request for deleting a post.
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const client = new MongoClient(process.env.DB_CONN);
        const db = client.db(process.env.DB_NAME);
        const posts = db.collection('posts');

        await posts.deleteOne({ id: parseInt(postId) });

        res.json({ message: "Post deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
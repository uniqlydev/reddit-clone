const post = require('../models/post');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');


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
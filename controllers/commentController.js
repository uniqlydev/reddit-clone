const Comment = require('../models/comment');
const {client, DB_NAME} = require('../models/database');
const { application } = require('express');
const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb')


// GET request for list of all comments.
exports.getComments = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const comments = db.collection('comments');
        const commentList = await comments.find().toArray();
        res.json(commentList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// POST request for editing a comment.
exports.editComment = async (req, res) => {
    const { commentId, content, username } = req.body;

    // Check if user is logged in
    if (!req.session.authenticated) {
        res.status(403).json({ message: "You must be logged in to edit a comment" });
        return;
    }

    // Check if user is the owner of the comment
    if (username !== req.session.username) {
        res.status(403).json({ message: "You do not have permission to edit this comment" });
        return;
    }

    try {
        const db = client.db(DB_NAME);
        const comments = db.collection('comments');

        if (content === '') {
            res.status(400).json({ message: "New message cannot be empty!" });
            return;
        }

        await comments.updateOne(
            { _id: new ObjectId(commentId)}, 
            { $set: {
                    content: content,
                    edited: true
                }
            });

        res.json({ message: "Comment deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
// GET request for a single comment.
exports.getComment = async (req, res) => {
    try {
        const { id } = req.params;
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const comments = db.collection('comments');
        const comment = await comments.findOne({ id: parseInt(id) });
        const username = comment.user.substring(2)
        const user = await users.findOne({ username });
        const avatar = user.avatar;

        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
        }

        res.json({ comment, avatar, username });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// POST request for creating a comment.
exports.createComment = async (req, res) => {
    const { postId, content, parent } = req.body;
    const db = client.db(DB_NAME);
    const comments = db.collection('comments');

    if (!req.session.authenticated) {
        res.status(403).json({ message: "You must be logged in to comment" });
        return;
    }

    try {
        if (content === '') {
            res.status(400).json({ message: "Comment cannot be empty!" });
            return;
        }

        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const highestId = await comments.find().sort({ id: -1 }).limit(1).toArray();
        const id = highestId.length === 0 ? 1 : highestId[0].id + 1;

        // Create a new Comment document using the Mongoose model
        const newComment = new Comment({
            postId,
            commentId: id,
            content,
            user: req.session.username,
            date: date,
            edited: false,
            parent: parent ? new ObjectId(parent) : parent,
        });

        // Save the new comment to the database
        const ins = await comments.insertOne(newComment);

        // Increment comment post count
        const posts = db.collection('posts');

        await posts.updateOne({ id: parseInt(postId)}, 
        {
            $inc: {
                comments: 1
            }
        });

        console.log(ins)
        console.log(JSON.stringify(comments.find({})))

        res.json({ message: "Comment created" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// POST request for deleting a comment.
exports.deleteComment = async (req, res) => {
    const { commentId, username } = req.body;

    // Check if user is logged in
    if (!req.session.authenticated) {
        res.status(403).json({ message: "You must be logged in to delete a comment" });
        return;
    }

    // Check if user is the owner of the comment
    if (username !== req.session.username) {
        res.status(403).json({ message: "You do not have permission to delete this comment" });
        return;
    }


    try {
        const db = client.db(DB_NAME);
        const comments = db.collection('comments');
        await comments.updateOne({ _id: new ObjectId(commentId)}, 
        {
            $set: {
                user: "[deleted]",
                content: "[removed]"
            }
        });


        // Decrement comment post count
        const posts = db.collection('posts');
        const comment = await comments.findOne({ _id: new ObjectId(commentId) });
        await posts.updateOne({ id: parseInt(comment.postId)}, 
        {
            $inc: {
                comments: -1
            }
        });


        res.json({ message: "Comment deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

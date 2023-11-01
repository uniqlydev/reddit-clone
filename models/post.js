const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    subreddit: String,
    description: String,
    body: String,
    upvotes: Number,
    comments: Number,
    downvotes: Number,
});

const post = mongoose.model('post', postSchema);

module.exports = post;
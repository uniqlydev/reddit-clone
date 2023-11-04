const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: Number,
    title: String,
    body: String,
    upvotes: Number,
    comments: Number,
    downvotes: Number,
    user: String,
    date: String,
});

const post = mongoose.model('post', postSchema);

module.exports = post;
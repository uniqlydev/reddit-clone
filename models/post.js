const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: Number,
    title: String,
    body: String,
    upvotes: Number,
    comments: Number,
    user: String,
    date: String,
    edited: Boolean,
});

const post = mongoose.model('post', postSchema);

module.exports = post;
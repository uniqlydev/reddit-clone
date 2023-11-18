var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({
    postId: Number,
    commentId: Number,
    content: String,
    upvotes: Number,
    downvotes: Number,
    user: String,
    date: String,
    edited: Boolean,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
});


const comment = mongoose.model('comments', commentSchema);
module.exports = comment;
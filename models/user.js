const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    bio: String,
    memberURL: String,
    avatar: String,
    likedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'posts',
        },
    ],
});

const user = mongoose.model('user', userSchema);

module.exports = user;
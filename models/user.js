const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    username: String,
    password: String,
    bio: String,
    memberSince: String,
    bday: String,
    memberURL: String,
    avatar: String,
    karma: Number,
});

const user = mongoose.model('user', userSchema);

module.exports = user;
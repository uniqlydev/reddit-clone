const User = require('../models/user');
const bcrypt = require('bcrypt');
const {client, DB_NAME} = require('../database/database');
const user = require('../models/user');

// POST 
exports.registerUser = async (req, res) => {

    const db = client.db(DB_NAME);
    const users = db.collection('users');
    try {
        const { username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            res.status(400).json({ message: "Passwords do not match!" });
            return;
        }

        // Check if the username already exists using Mongoose
        const existingUser = await users.findOne({ username });

        if (existingUser) {
            res.status(400).json({ message: "Username is already taken!" });
            return;
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document using the Mongoose model
        const newUser = new User({
            username,
            password: hashedPassword,
            bio: '',
            memberURL: 'u/' + username,
            avatar: '',
            likedPosts: [],
            dislikedPosts: [],
        });

        // Save the new user to the database
        await users.insertOne(newUser);

        res.json({ message: "Registration successful" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const userLogin = await users.findOne({ username });

        if (!userLogin) {
            res.status(401).json({ message: "Invalid credentials!" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, userLogin.password);

        if (passwordMatch) {
            if (!req.session) {
                req.session = {};
            }

            if (req.session.authenticated) {
                req.session.username = username;
                res.status(201).json(req.session);
            } else {
                req.session.authenticated = true;
                req.session.username = username;
                res.status(201).json(req.session);
            }
        } else {
            res.status(401).json({ message: "Invalid credentials!" });
        }

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.editProfile = async (req, res) => {
    try {
        const { username, bio } = req.body;

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const users = db.collection('users');

        await users.updateOne(
            { username: username },
            { $set: { bio: bio } }
        );

        res.json({ message: "Profile edited" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


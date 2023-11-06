const user = require('../models/user');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// POST 
exports.registerUser = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        const client = new MongoClient(process.env.DB_CONN);
        const db = client.db(process.env.DB_NAME);
        const users = db.collection('users');
        const existingUser = await users.findOne({ username });

        if (password !== confirmPassword) {
            res.status(400).json({ message: "Passwords do not match!" });
            return;
        }

        if (existingUser) {
            res.status(400).json({ message: "Username is already taken!" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            username,
            password: hashedPassword,
            bio: '',
            memberURL: 'u/' + username,
            avatar: '',
        }

        await users.insertOne(userData);

        res.json({ message: "Registration successful" });
    }catch(e) {
        res.status(500).json({ message: e.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const client = new MongoClient(process.env.DB_CONN);
        const db = client.db(process.env.DB_NAME);
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


const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const DB_CONN = "mongodb+srv://matthewwassmer:ccapdev@reddit-clone.kqn3zsq.mongodb.net/";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                errorMsg.textContent = "Login Successful!";
            } else {
                errorMsg.textContent = "Login Failed! Please check your credentials.";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});

function register() {
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    if (checkMissingRegister(email, username, password, confirmPassword)) {
        return;
    } else {
        // Add user to database (Phase 2 implementation)
        window.location.href = '/';
    }
}
const mongoose = require('mongoose');

function checkMissingLogin(username, password) {
    if (username == "" || password == "") {
        alert("Please fill in all fields");
        return true;
    }
}

function checkMissingRegister(email, username, password, confirmPassword) {
    var emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return true;
    }

    if (email == "" || username == "" || password == "" || confirmPassword == "") {
        alert("Please fill in all fields");
        return true;
    }

    if (password != confirmPassword) {
        alert("Passwords do not match");
        return true;
    }

}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // Idk what to do with remember yet (Phase 2 implementation)
    var remember = document.getElementById("remember").checked;

    if (checkMissingLogin(username, password)) {
        return;
    } else {
        
    }

    return;
}

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
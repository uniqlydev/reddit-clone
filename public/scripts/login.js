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

    // Get the form element
    var form = document.querySelector('form');

    // Set the form's action attribute to the root URL
    form.method = 'POST';
    form.action = '/';

    // Create hidden input fields for username and password
    var usernameInput = document.createElement('input');
    usernameInput.type = 'hidden';
    usernameInput.name = 'username';
    usernameInput.value = username;

    var passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = password;

    // Append the hidden input fields to the form
    form.appendChild(usernameInput);
    form.appendChild(passwordInput);

    // Submit the form
    form.submit();
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
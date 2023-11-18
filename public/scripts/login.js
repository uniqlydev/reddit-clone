document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === '' || password === '') {
            errorMsg.textContent = "Fields cannot be empty!";
            return;
        }

        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            errorMsg.textContent = "Login successful";
            window.location.href = '/';
            // window.location.href = `/profile?username=${username}`;
        } else {
            errorMsg.textContent = data.message;
        }
    });
});
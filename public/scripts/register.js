document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const statusMsg = document.getElementById('status-msg');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;



        if (username === '' || password === '' || confirmPassword === '') {
            statusMsg.textContent = "Fields cannot be empty!";
            return;
        }

        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, confirmPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            statusMsg.textContent = "Registration successful";
            window.location.href = '/';
        } else {
            statusMsg.textContent = data.message;
        }
    });
});
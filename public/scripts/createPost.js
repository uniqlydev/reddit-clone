document.addEventListener('DOMContentLoaded', () => {
    const statusMsg = document.getElementById('status-msg');
    const postSubmit = document.getElementById('post-submit');

    postSubmit.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title-input').value;
        const body = document.getElementById('body-input').value;

        const response = await fetch('/api/posts/create-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body }),
        });

        const data = await response.json();

        if (response.ok) {
            statusMsg.textContent = "Post created";
            window.location.href = '/';
        } else {
            statusMsg.textContent = data.message;
        }
    });

    const login = document.getElementById('loginbtn');
    // If login is null, it means the user is already logged in 
    if (login === null) {
        const loggedin = document.getElementById('loggedin');
        // View profile get username from p tag under button
        loggedin.addEventListener('click', () => {
            const username = document.getElementById('logged-user').innerText;
            window.location.href = `/profile?username=${username}`;
        });
    } else {
        login.addEventListener('click', () => {
            window.location.href = `/login`;
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // const postForm = document.getElementById('postForm');
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

    const searchBar = document.getElementById('search');

    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/search?query=${searchQuery}`;
        }
    });
});
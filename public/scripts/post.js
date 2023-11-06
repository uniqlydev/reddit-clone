document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const editPostForm = document.getElementById('editPostForm');
    const statusMsg = document.getElementById('status-msg');

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title-input').value;
        const body = document.getElementById('body-input').value;

        const response = await fetch('/create-post', {
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

    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        
    });
});
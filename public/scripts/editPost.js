document.addEventListener('DOMContentLoaded', () => {
    const editPostForm = document.getElementById('editPostForm');
    const statusMsg = document.getElementById('status-msg');

    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title-input').value;
        const body = document.getElementById('body-input').value;

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        const response = await fetch('/api/posts/edit-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, title, body }),
        });

        const data = await response.json();

        if (response.ok) {
            statusMsg.textContent = "Post edited";
            window.location.href = '/posts?id=' + postId;
        } else {
            statusMsg.textContent = data.message;
        }
    });
});
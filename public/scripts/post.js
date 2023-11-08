document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editBtn');
    const deletebtn = document.getElementById('deleteBtn');

    editBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        window.location.href = '/edit-post?id=' + postId;
    });

    deletebtn.addEventListener('click', async (e) => {
        // Retrieve ID from URL query string
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        // POST req to delete post
        const response = await fetch('/api/posts/delete-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId }),
        });

        // Redirect to home page if successful
        if (response.ok) {
            window.location.href = '/';
        }else {
            const data = await response.json();
            alert(data.message);
        }
    });

});
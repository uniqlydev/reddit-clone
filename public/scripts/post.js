document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editBtn');

    editBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        window.location.href = '/edit-post?id=' + postId;
    });
});
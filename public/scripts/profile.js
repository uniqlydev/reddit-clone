document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');

    postsContainer.addEventListener('click', async (e) => {
        const clickedDiv = e.target.closest('div');

        if (clickedDiv) {
            const divId = clickedDiv.id;
            if (divId) {
                window.location.href = `/posts?id=${divId}`;   
            }
        }
    });

    const newPost = document.getElementById('new-post');

    newPost.addEventListener('click', async (e) => {
        window.location.href = '/create-post';
    });

    const styleAvatar = document.getElementById('style-avatar');

    styleAvatar.addEventListener('click', async (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        window.location.href = `/profile-edit?username=${username}`;
    });
});
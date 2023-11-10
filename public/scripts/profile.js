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
    const searchBar = document.getElementById('search');

    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/search?query=${searchQuery}`;
        }
    });
});
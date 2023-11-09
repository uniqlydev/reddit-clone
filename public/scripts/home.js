// function redirectToSubreddit(url) {
//     window.location.href = url;
// }

document.addEventListener('DOMContentLoaded', function() {
    const login = document.getElementById('loginbtn');
    login.addEventListener('click', () => {
        window.location.href = `/login`;
    });

    const posts = document.getElementById('posts');

    posts.addEventListener('click', async (e) => {
        const clickedLi = e.target.closest('li');

        if (clickedLi) {
            const liId = clickedLi.id;
            if (liId) {
                window.location.href = `/posts?id=${liId}`;   
            }
        }
    });

    const searchBar = document.getElementById('search-bar');

    // Event listener for enter key
    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/login`;
            // window.location.href = `/search?query=${searchQuery}`;
        }
    });
});
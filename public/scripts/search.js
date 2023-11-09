document.addEventListener('DOMContentLoaded', function() {
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

    const searchBar = document.getElementById('search');

    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/search?query=${searchQuery}`;
        }
    });
});
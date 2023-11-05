function redirectToSubreddit(url) {
    window.location.href = url;
  }

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
});
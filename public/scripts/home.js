function redirectToSubreddit(url) {
    window.location.href = url;
  }

document.addEventListener('DOMContentLoaded', function() {
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
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

        const profilepic = document.getElementById('profile-pic');

        // add image source
        
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
  
    const searchBar = document.getElementById('search');

    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/search?query=${searchQuery}`;
        }
    });
});
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
            window.location.href = '/posts?id=' + postId;
        }
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

    const upvotebtn = document.getElementById('upvotebtn');
    const downvotebtn = document.getElementById('downvotebtn');
    const votecount = document.getElementById('vote-count');

    upvotebtn.addEventListener('click', async (e) => {
        const count = votecount.innerText;

        // Convert to int
        let intCount = parseInt(count);

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        const response = await fetch('/api/posts/upvote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, voteCount: intCount }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/posts?id=' + postId;
        } else {
            alert(data.message);
            window.location.href = '/posts?id=' + postId;
        }
    });

    downvotebtn.addEventListener('click', async (e) => {
        const count = votecount.innerText;

        // Convert to int
        let intCount = parseInt(count);

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        const response = await fetch('/api/posts/downvote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, voteCount: intCount }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/posts?id=' + postId;
        } else {
            alert(data.message);
            window.location.href = '/posts?id=' + postId;
        }
    });
});
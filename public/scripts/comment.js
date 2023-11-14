document.addEventListener('DOMContentLoaded', () => {
    const commentSubmit = document.getElementById('add-comment');

    commentSubmit.addEventListener('click', async (e) => {
        e.preventDefault();

        const postId = new URL(location.href).searchParams.get('id')
        const content = document.getElementById('comment-box').value;

        if (content === '') return

        const response = await fetch('/api/comments/create-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('comment-box').value = ""

            // refresh page
            window.location = window.location
        } else {
            alert('Server error!')
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

const commentDelete = async (obj) => {
    let comment = obj
    while (!comment.id) {
        comment = comment.parentNode
    }

    const commentId = comment.id

    const response = await fetch('/api/comments/delete-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById(commentId).innerHTML = ""
    } else {
        alert('Server error!')
    }
}

const commentFunctions = (evt) => {
    if (evt.target.classList.contains("delete")) {
        commentDelete(evt.target)
    }
}

document.addEventListener("click", commentFunctions);

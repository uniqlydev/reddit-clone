document.addEventListener('DOMContentLoaded', () => {
    const commentSubmit = document.getElementById('add-comment');

    const editModal = document.getElementById('edit-modal')

    document.getElementById('edit-cancel').addEventListener('click', () => editModal.close())

    commentSubmit.addEventListener('click', async (e) => {
        e.preventDefault();

        const postId = new URL(location.href).searchParams.get('id')
        const content = document.getElementById('comment-box').value;

        if (content === '') return

        const response = await fetch('/api/comments/create-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content, parent: null }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('comment-box').value = ""
            window.location = window.location
        } else {
            alert(data.message);
        }
    });

    const showReply = (obj) => {
        let actions = obj.parentNode.parentNode.parentNode
    
        actions.childNodes.forEach( (child) => {
            if (child.className === "comment-reply-box") {
                if (child.style.display === 'none') {
                    child.style.display = 'block'
                }
                else {
                    child.style.display = 'none'
                }
                return
            }
        })
    }
    
    const commentReply = async (obj) => {
        const postId = new URL(location.href).searchParams.get('id')
        const content = obj.previousElementSibling.value
    
        if (content === '') {
            obj.parentNode.display = 'none'
            return
        }
    
        // get parent id
        let comment = obj
        while (!comment.id) {
            comment = comment.parentNode
        }
        const parent = comment.id
    
        const response = await fetch('/api/comments/create-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content, parent }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            // refresh page
            window.location = window.location
        } else {
            alert('Server error!')
        }
    }
    
    const commentDelete = async (obj) => {
        let comment = obj
        while (!comment.id) {
            comment = comment.parentNode
        }
    
        const commentId = comment.id
        const username = document.getElementById('username').innerHTML.trim()
    
        const response = await fetch('/api/comments/delete-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commentId, username }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            window.location = window.location
        } else {
            alert(data.message);
        }
    }
    
    const commentEdit = async (e, currContent) => {
        const commentId = document.getElementsByClassName('comment-id-holder')[0].id
        const content = document.getElementById('edit-textarea').value;
        const username = document.getElementById('commentUsername').innerHTML.trim()

        if (currContent === content) {
            editModal.close()
            return
        }

        const response = await fetch('/api/comments/edit-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commentId, content, username }),
        });

        const data = await response.json();

        if (response.ok) {
            const comment = document.getElementById(commentId)
            comment.lastElementChild.firstElementChild.innerHTML = content
            editModal.close()
            window.location = window.location
        } else {
            alert(data.message);
        }
    }

    const showEdit = (obj) => {
        const currContent = obj.parentNode.previousElementSibling.innerHTML.trim()
        const textarea = document.getElementById('edit-textarea')

        let comment = obj
        while (!comment.id) {
            comment = comment.parentNode
        }

        textarea.value = currContent

        document.getElementsByClassName('comment-id-holder')[0].id = comment.id

        editModal.showModal()

        document.getElementById('comment-edit-submit')
            .addEventListener("click", async (e, currContent) => {
                await commentEdit(e, currContent)
            });
    }


    const commentFunctions = (evt) => {
        if (evt.target.classList.contains("delete")) {
            commentDelete(evt.target)
        }
        if (evt.target.classList.contains("reply")) {
            showReply(evt.target)
        }
        if (evt.target.classList.contains("submit-reply")) {
            evt.preventDefault()
            commentReply(evt.target)
        }
        if (evt.target.classList.contains("edit-button")) {
            showEdit(evt.target)
        }
    }
    
    document.addEventListener("click", commentFunctions);

    const searchBar = document.getElementById('search');

    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/search?query=${searchQuery}`;
        }
    });
});
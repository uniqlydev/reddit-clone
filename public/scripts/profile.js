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
});
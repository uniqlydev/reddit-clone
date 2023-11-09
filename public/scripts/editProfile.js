document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('cancel-button');

    cancelBtn.addEventListener('click', async (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        window.location.href = `/profile?username=${username}`;
    });

    const saveBtn = document.getElementById('save-button');
    const statusText = document.getElementById('status-text');

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const bio = document.getElementById('edit-bio').value;
        // Will add image upload later

        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');

        const response = await fetch('api/user/profile-edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, bio }),
        });

        const data = await response.json();

        if (response.ok) {
            statusText.textContent = "Profile edited";
            window.location.href = `/profile?username=` + username;
        } else {
            statusText.textContent = data.message;
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
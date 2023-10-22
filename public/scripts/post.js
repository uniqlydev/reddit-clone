document.addEventListener('DOMContentLoaded', function() {
    const edit = document.getElementById('editbtn');

    edit.addEventListener('click', () => {
        window.location.href = `/edit-post`;
    });


});
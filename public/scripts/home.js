
function redirectToSubreddit(url) {
    window.location.href = url;
  }


document.addEventListener('DOMContentLoaded', function() {

    const login = document.getElementById('loginbtn');
    login.addEventListener('click', () => {
        window.location.href = `/login`;
    });

    
});
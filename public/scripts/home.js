
document.addEventListener('DOMContentLoaded', function() {

    const login = document.getElementById('loginbtn');

    login.addEventListener('click', () => {
        window.location.href = `/profile?username=${"Machewww"}`;
    });
});
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        const icon = toggle.querySelector('box-icon');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('name', 'hide');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('name', 'show');
        }
    });
});



const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const registerBtn2 = document.getElementById('register2');
const loginBtn2 = document.getElementById('login2');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
registerBtn2.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn2.addEventListener('click', () => {
    container.classList.remove("active");
});

document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = toggle.previousElementSibling;
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



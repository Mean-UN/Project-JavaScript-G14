import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBPCMFbCMUpkQO6nHhz9GPf8muARAmTNqk",
    authDomain: "project-js-g14.firebaseapp.com",
    projectId: "project-js-g14",
    storageBucket: "project-js-g14.firebasestorage.app",
    messagingSenderId: "500769039233",
    appId: "1:500769039233:web:7d2634595f982cd17f3e80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



// submit 
const signUp = document.getElementById("signUp");

signUp.addEventListener("click", function(event) {
    event.preventDefault();
    // input 
    const name = document.getElementById("signUp-Uname").value;
    const email = document.getElementById("signUp-email").value;
    const password = document.getElementById("signUp-password").value;
    if (name && email && password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("User registered successfully");
                console.log(name);
                window.location.href = "pages/Dashboard.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);

        });
    } else {
        alert("Please enter all the fields");
    }
});
console.log("Please enter your email and password");

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


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
const signUp = document.getElementById("signIn");

signUp.addEventListener("click", function(event) {
    event.preventDefault();
    // input 
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                window.location.href = "pages/Dashboard.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                $.notify("Your Email or Password is incorrect!", {
                    className: "warn",
                    globalPosition: "top right"
                });

        });
    } else {
        $.notify("Please Enter your Email, and Password", {
            className: "warn",
            globalPosition: "top right"
        });
    }
});
console.log("Please enter your email and password");

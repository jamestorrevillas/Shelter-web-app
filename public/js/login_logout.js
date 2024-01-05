import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCBuYPKdZmVNe8BNMClJlNcK_ZkZ89qh1Q",
    authDomain: "furry-found.firebaseapp.com",
    databaseURL: "https://furry-found-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "furry-found",
    storageBucket: "furry-found.appspot.com",
    messagingSenderId: "283444505486",
    appId: "1:283444505486:web:b0f69ce6e33a28aa46d2df",
    measurementId: "G-8W6BBZYCHZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = "pets.html";
        })
        .catch((error) => {
            console.error(`Login failed: ${error.message}`);
            alert("Login failed. Please check your email and password.");
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login");

    function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        loginUser(email, password);
    }

    if (loginButton) {
        loginButton.addEventListener("click", handleLogin);
    }

    if (emailInput && passwordInput) {
        emailInput.addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                handleLogin();
            }
        });

        passwordInput.addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                handleLogin();
            }
        });
    }

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            logoutUser();
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is already signed in");
        } else {
            console.log("No user is signed in.");
        }
    });
});

function logoutUser() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Logout failed", error);
    });
}

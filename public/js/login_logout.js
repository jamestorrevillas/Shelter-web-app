// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
            const user = userCredential.user;
            console.log("User logged in:", user);

            // Redirect to another HTML file
            window.location.href = "../pages/dashboard.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Login failed with error (${errorCode}): ${errorMessage}`);
            alert("Login failed. Please check your email and password.");
        });
}


document.getElementById("login").addEventListener("click", function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginUser(email, password);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is already signed in:", user);
        // Redirect or perform any other actions for already signed-in users
    } else {
        console.log("No user is signed in.");
    }
});


// Add this function to handle logout
function logoutUser() {
    auth.signOut().then(() => {
        console.log("User logged out");
        // Redirect to login.html after logout
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Logout failed", error);
    });
}

// Assuming you have an element with id "logout" for the logout link
document.getElementById("logout").addEventListener("click", function () {
    logoutUser();
});

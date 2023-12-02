// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Your Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Function to send password reset email
function sendPasswordReset(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent successfully");
            // Add any additional UI feedback here if needed
            alert("Password reset email sent successfully. Check your email inbox.");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Password reset email failed with error (${errorCode}): ${errorMessage}`);
            // Add any additional UI feedback here if needed
            alert("Password reset email failed. Please check your email address and try again.");
        });
}

// Event listener for the password reset form
document.getElementById("password-reset-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    sendPasswordReset(email);
});

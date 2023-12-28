// Import the necessary functions from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Your web app's Firebase configuration
// Replace this with your actual Firebase configuration
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
const auth = getAuth(app);
const database = getDatabase(app);

// Add an event listener to the change-password-form
document.addEventListener('DOMContentLoaded', function () {
    const changePasswordForm = document.getElementById('change-password-form');

    changePasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        try {
            if (newPassword !== confirmNewPassword) {
                throw new Error('New password and confirmation do not match');
            }

            const user = auth.currentUser;

            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            alert('Password changed successfully!');
            changePasswordForm.reset();
        } catch (error) {
            alert('Error changing password: ' + error.message);
        }
    });
});

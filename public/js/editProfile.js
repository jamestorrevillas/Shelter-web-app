// Import the necessary functions from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

// Add an event listener to the edit-profile-form
document.addEventListener('DOMContentLoaded', function () {
    const editProfileForm = document.getElementById('edit-profile-form');

    editProfileForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('shelter-name-input').value;
        const email = document.getElementById('email-input').value;

        try {
            const user = auth.currentUser;

            // Update the user profile in Firebase Authentication
            await updateProfile(user, { displayName: name });

            // Update additional user data in the Realtime Database (assuming 'shelters' is your data structure)
            const userId = user.uid;
            const userRef = ref(database, `shelters/${userId}`);
            await set(userRef, { shelter_name: name, email: email });

            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    });
});

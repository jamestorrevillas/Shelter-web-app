// Import the necessary functions from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, updateProfile, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', function () {
    const editProfileForm = document.getElementById('edit-profile-form');

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const name = document.getElementById('editShelterName').value;
            const email = document.getElementById('editShelterEmail').value;
            const password = document.getElementById('editPassword').value;

            try {
                const user = auth.currentUser;

                // Update the user profile in Firebase Authentication
                await updateProfile(user, { displayName: name });
                await updateEmail(user, email);
                await updatePassword(user, password);

                // Upload profile picture to Firebase Storage
                const profilePicInput = document.getElementById('editProfilePic');
                if (profilePicInput.files.length > 0) {
                    const profilePicFile = profilePicInput.files[0];
                    const storageRef = ref(storage, `profile_pics/${user.uid}/${profilePicFile.name}`);
                    await uploadBytes(storageRef, profilePicFile);
                }

                // Update additional user data in the Realtime Database (assuming 'shelters' is your data structure)
                const userId = user.uid;
                const userRef = ref(database, `shelters/${userId}`);
                await set(userRef, {
                    shelter_name: name,
                    email: email,
                    password: password,
                    // Add other fields like address and contact number as needed
                });

                alert('Profile updated successfully!');
            } catch (error) {
                alert('Error updating profile: ' + error.message);
            }
        });

        // Function to pre-fill the form with existing user details
        async function preFillForm(userDetails) {
            document.getElementById('editShelterName').value = userDetails.displayName || '';
            document.getElementById('editShelterEmail').value = userDetails.email || '';
            // Pre-fill other fields as needed

            // Fetch and display profile picture if available
            const profilePicElement = document.getElementById('editProfilePic');
            const profilePicRef = ref(storage, `profile_pics/${auth.currentUser.uid}`);
            try {
                const downloadURL = await getDownloadURL(profilePicRef);
                profilePicElement.src = downloadURL;
            } catch (error) {
                // Handle error (e.g., display a default image)
                console.error('Error getting download URL for profile picture:', error.message);
            }
        }

        // Fetch user details from Firebase and pre-fill the form
        onValue(ref(database, `shelters/${auth.currentUser.uid}`), (snapshot) => {
            const userDetails = snapshot.val();
            if (userDetails !== null) {
                preFillForm(userDetails);
            }
        });
    } else {
        console.error('Form with ID "edit-profile-form" not found.');
    }
});
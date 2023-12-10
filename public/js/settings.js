import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// Function to fill the form with existing user details
function fillForm(userDetails) {
    document.getElementById('editShelterName').value = userDetails.name || '';
    document.getElementById('editShelterEmail').value = userDetails.email || '';
    
    // Check if 'address' and 'contact_number' exist in userDetails before accessing
    if ('address' in userDetails) {
        document.getElementById('editAddress').value = userDetails.address;
    }

    if ('contact_number' in userDetails) {
        document.getElementById('editContactNumber').value = userDetails.contact_number;
    }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Listen for changes in authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, fetch their details from Firebase
            const user_id = user.uid;
            const userRef = ref(database, `shelters/${user_id}`);
            
            onValue(userRef, (snapshot) => {
                const userDetails = snapshot.val();
                if (userDetails !== null) {
                    fillForm(userDetails);
                }
            });
        } else {
            // User is signed out, handle accordingly
            console.log("User is signed out");
        }
    });
});

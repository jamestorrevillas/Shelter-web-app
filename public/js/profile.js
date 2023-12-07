// Import Firebase Authentication module
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function () {
    var nameInput = document.getElementById('shelter-name-input');
    var emailInput = document.getElementById('email-input');

    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            var shelterUserId = user.uid;

            var userRef = ref(database, 'shelters/' + shelterUserId);

            onValue(userRef, (snapshot) => {
                var userData = snapshot.val();
                nameInput.value = userData?.shelter_name || "";
                emailInput.value = userData?.email || "";
            }, (error) => {
                console.error("Error fetching data from Firebase:", error);
            });
        } else {
            console.log("No user is signed in.");
        }
    });
});

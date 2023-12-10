// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Replace with your actual Firebase configuration

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
const database = getDatabase(app);

// Get a reference to the 'applications' node in the database
const applicationsRef = ref(database, 'applications');

// Function to display application details in the input fields
function displayApplicationDetails() {
    // Replace 'APPLICATION_ID' with the actual application ID you want to display
    const applicationId = 'APPLICATION_ID';

    const applicationDetailsSection = document.getElementById('application-details');
    const shelterNameInput = document.getElementById('editShelterName');
    const shelterEmailInput = document.getElementById('editShelterEmail');
    const addressInput = document.getElementById('editAddress');
    const contactNumberInput = document.getElementById('editContactNumber');

    // Fetch the application details from the database
    onValue(ref(applicationsRef, applicationId), (snapshot) => {
        const applicationDetails = snapshot.val();

        // Check if the application details exist
        if (applicationDetails) {
            shelterNameInput.value = applicationDetails.name;
            shelterEmailInput.value = applicationDetails.email;
            addressInput.value = applicationDetails.address;
            contactNumberInput.value = applicationDetails.contactNumber;
        } else {
            console.error('Application details not found');
        }
    });
}

// Function to be called when the 'Approve' button is clicked
function approveApplication() {
    // Add logic to update the application status or perform other actions
    alert('Application approved!');
}

// Function to be called when the 'Disapprove' button is clicked
function disapproveApplication() {
    // Add logic to update the application status or perform other actions
    alert('Application disapproved!');
}

// Call the function to display application details when the page loads
displayApplicationDetails();

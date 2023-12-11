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

// Get a reference to the 'applicationform' node in the database
const applicationformRef = ref(database, 'applicationform');

// Function to display application details in the input fields
function displayApplicationDetails() {
    
    const shelterNameInput = document.getElementById('ShelterName');
    const shelterEmailInput = document.getElementById('ShelterEmail');
    const addressInput = document.getElementById('Address');
    const contactNumberInput = document.getElementById('ContactNumber');

    // Fetch the application details from the database
    onValue(applicationformRef, (snapshot) => {
        const applicationData = snapshot.val();

        // Check if the application details exist
        if (applicationData) {
            // Iterate over each application
            for (const applicationKey in applicationData) {
                const application = applicationData[applicationKey];

                // Create a new set of input fields for each application
                const newSetOfFields = document.createElement('div');

                // Use the application data to populate the input fields
                shelterNameInput.value = application.fullname;
                shelterEmailInput.value = application.email;
                addressInput.value = application.address;
                contactNumberInput.value = application.phone_number;

                // Append the new set of fields to the document
                document.body.appendChild(newSetOfFields);
            }
        } else {
            console.error('Application details not found');
        }
    });
}


// function approveApplication() {

//     alert('Application approved!');
// }


// function disapproveApplication() {

//     alert('Application disapproved!');
// }


displayApplicationDetails();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";


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
const storage = getStorage(app);

const params = new URLSearchParams(window.location.search);
const petId = params.get('id');

const petRef = ref(database, `pets/${petId}`);

const editPetForm = document.getElementById('editPetForm');

editPetForm.addEventListener('submit', function (event) {
    event.preventDefault();

    onValue(petRef, (snapshot) => {
        const existingPetDetails = snapshot.val();

    // Get updated pet details from the form
    const updatedPetDetails = {
        imageUrl: document.getElementById('editPetImage').src,
        name: document.getElementById('editPetName').value,
        type: document.getElementById('editPetType').value,
        age: document.getElementById('editPetAge').value,
        color: document.getElementById('editPetColor').value,
        weight: document.getElementById('editPetWeight').value,
        description: document.getElementById('editPetDescription').value,
        status: existingPetDetails.status, 
        daysAtShelter: existingPetDetails.daysAtShelter,
    };

    // Update the pet details in Firebase
    set(petRef, updatedPetDetails)
        .then(() => {
            alert('Pet details updated successfully!');
            window.location.href = 'pets.html'; // Redirect to the pets page
        })
        .catch((error) => {
            console.error('Error updating pet details:', error.message);
        });
});
});
// Function to pre-fill the form with existing pet details
async function preFillForm(petDetails) {

    const editPetImage = document.getElementById('editPetImage');
    
    if (petDetails.imageUrl) {
        try {
            // Get the download URL for the image using the stored URL
            const imageUrl = await getDownloadURL(storageRef(storage, petDetails.imageUrl));

            // Set the src attribute of the editPetImage element
            editPetImage.src = imageUrl;
        } catch (error) {
            console.error('Error getting download URL for image:', error.message);
            // Handle the error (e.g., display a default image)
        }
    }

    document.getElementById('editPetName').value = petDetails.name || '';
    document.getElementById('editPetType').value = petDetails.type || '';
    document.getElementById('editPetAge').value = petDetails.age || '';
    document.getElementById('editPetColor').value = petDetails.color || '';
    document.getElementById('editPetWeight').value = petDetails.weight || '';
    document.getElementById('editPetDescription').value = petDetails.description || '';
    // document.getElementById('editPetStatus').value = petDetails.status || '';
    // document.getElementById('editPetDays').value = petDetails.daysAtShelter || '';

    // Pre-fill other fields as needed
}

// Fetch pet details from Firebase and pre-fill the form
onValue(petRef, (snapshot) => {
    const petDetails = snapshot.val();
    if (petDetails !== null) {
        preFillForm(petDetails);
    }
});

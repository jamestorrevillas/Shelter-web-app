// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// Your web app's Firebase configuration
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
const storage = getStorage(app);

// Function to handle form submission
function addPet() {

    console.log('Button clicked!');
    const petImage = document.getElementById('petImage').files[0];
    const petName = document.getElementById('petName').value;
    const petType = document.getElementById('petType').value;
    const petAge = document.getElementById('petAge').value;
    const petColor = document.getElementById('petColor').value;
    const petWeight = document.getElementById('petWeight').value;
    const petDays = document.getElementById('petDays').value;
    const petDescription = document.getElementById('petDescription').value;

    // const existingPet = Array.from(document.getElementById('table-body-below').children).find((row) => {
    //     const nameCell = row.children[0];
    //     const ageCell = row.children[1];
    //     const weightCell = row.children[2];
    //     return (
    //         nameCell.textContent === petName &&
    //         ageCell.textContent === petAge &&
    //         weightCell.textContent === petWeight
    //     );
    // });

    // // If the pet already exists, display an error message and return
    // if (existingPet) {
    //     alert('Error: This pet already exists.');
    //     return;
    // }
    // Upload pet image to Firebase Storage
    const storageRefPath = storageRef(storage, `pet_images/${petImage.name}`);
    const uploadTask = uploadBytes(storageRefPath, petImage);
  
    // Handle the completion of the image upload
    uploadTask.then((snapshot) => {
        // Get the reference to the uploaded image file
        const imageRef = snapshot.ref; // Define imageRef here
        return getDownloadURL(imageRef);
    }).then((downloadURL) => {
        // Save pet data to the Firebase Realtime Database
        const petData = {
            name: petName,
            type: petType,
            age: petAge,
            color: petColor,
            weight: petWeight,
            daysAtShelter: petDays,
            description: petDescription,
            imageUrl: downloadURL
        };
  
        // Push the pet data to the "pets" node in the database
        const newPetRef = push(ref(database, 'pets'));
        return set(newPetRef, petData);
    }).then(() => {
        window.location.href = 'pets.html';
        // alert('Pet added successfully!');
        // Optionally, you can redirect or perform additional actions here
    }).catch((error) => {
        console.error('Error adding pet to the database:', error.message);
    });
}

// Event listener for the "ADD PET" button
document.getElementById('addPetBtn').addEventListener('click', addPet);


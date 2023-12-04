import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";


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
const database = getDatabase(app);
// Function to handle adding a new pet
async function addPet() {
    const name = document.getElementById('petName').value;
    const type = document.getElementById('petType').value;
    const age = document.getElementById('petAge').value;
    const color = document.getElementById('petColor').value;
    const weight = document.getElementById('petWeight').value;
    const days = document.getElementById('petDays').value;
    const description = document.getElementById('petDescription').value;
    const image = document.getElementById('petImage').files[0];

    if (!name || !type || !age || !color || !weight || !days || !description || !image) {
        alert('Please fill in all the pet details');
        return;
    }

    const formattedDays = new Date(days).toISOString();
    const petId = generateUniqueId();

    const petDetails = {
        name,
        type,
        age,
        color,
        weight,
        days: formattedDays,
        description
    };

    try {
        // Save pet image to Firebase Storage
        await saveImageToStorage(image, petId);

        // Save pet details to Firebase Realtime Database
        await set(ref(database, `pets/${petId}`), petDetails);

        alert('Pet added successfully!');
        window.location.href = 'pets.html';
    } catch (error) {
        console.error('Error adding pet:', error);
    
        if (error.code === 'storage/unauthorized') {
            alert('Error: Unauthorized access to storage. Please check your permissions.');
        } else {
            alert('Error adding pet. Please try again. Check the console for more details.');
        }
    }
    
}

    
// Function to generate a unique ID
function generateUniqueId() {
    const randomString = Math.random().toString(36).substring(2);
    const timestamp = (new Date()).getTime().toString(36);
    return randomString + timestamp;
}

// Function to save image to Firebase Storage
// Function to save image to Firebase Storage
function saveImageToStorage(image, petId) {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const storageRef = storageRef(storage, `pet_images/${petId}`);

        uploadBytes(storageRef, image)
            .then(snapshot => {
                console.log('Image uploaded successfully:', snapshot);
                resolve(snapshot);
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                reject(error);
            });
    });
}
document.getElementById('addPetBtn').addEventListener('click', addPet);
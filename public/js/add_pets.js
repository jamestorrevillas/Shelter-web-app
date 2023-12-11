// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
const auth = getAuth();

// Function to get the logged-in user's shelter ID
function getLoggedInShelterId() {
    const user = auth.currentUser;

    console.log('User Object:', user);

    // Adjust this based on your data structure
    const shelterId = user && user.uid ? user.uid : null;
    return shelterId;
}

// Function to handle form submission
async function addPet() {
    console.log('Button clicked!');
    const petImageInput = document.getElementById('petImage');
    const petImage = petImageInput.files[0];

    // Check if a file has been selected
    if (!petImage) {
        alert('Error: Please select a pet image.');
        return;
    }

    const petName = document.getElementById('petName').value;
    const petType = document.getElementById('petType').value;
    const petAge = document.getElementById('petAge').value;
    const petColor = document.getElementById('petColor').value;
    const petWeight = document.getElementById('petWeight').value;
    const petDays = document.getElementById('petDays').value;
    const petDescription = document.getElementById('petDescription').value;
    const petStatus = 'IN SHELTER';

    // Retrieve the logged-in user's shelter ID
    const loggedInShelterId = getLoggedInShelterId();

    const petAlreadyExists = await doesPetExist(petName, loggedInShelterId);

    if (petAlreadyExists) {
        alert('Error: This pet already exists.');
        return;
    }

    const storageRefPath = storageRef(storage, `pet_images/${petImage.name}`);
    const uploadTask = uploadBytes(storageRefPath, petImage);

    // Handle the completion of the image upload
    uploadTask.then((snapshot) => {
        // Get the reference to the uploaded image file
        const imageRef = snapshot.ref;
        return getDownloadURL(imageRef);
    }).then((downloadURL) => {
        // Generate a unique ID for the pet
        const petId = push(ref(database, 'pets')).key;

        // Save pet data to the Firebase Realtime Database
        const petData = {
            pet_id: petId,
            name: petName,
            type: petType,
            age: petAge,
            color: petColor,
            weight: petWeight,
            dateArrived: petDays,
            description: petDescription,
            imageUrl: downloadURL,
            status: petStatus,
            shelter_id: loggedInShelterId
        };

        // Set the pet data under the generated pet ID in the "pets" node
        return set(ref(database, `pets/${petId}`), petData);
    }).then(() => {
        window.location.href = 'pets.html';
    }).catch((error) => {
        console.error('Error adding pet to the database:', error.message);
    });
}

// Function to check if a pet with the same name already exists in the specified shelter
async function doesPetExist(petName, shelterId) {
    const petsRef = ref(database, 'pets');
    const snapshot = await get(petsRef);

    if (snapshot.exists()) {
        const pets = snapshot.val();
        return Object.values(pets).some((pet) => {
            return pet.name.toLowerCase() === petName.toLowerCase() &&
                pet.shelterId === shelterId;
        });
    }

    return false;
}

document.getElementById('addPetBtn').addEventListener('click', addPet);
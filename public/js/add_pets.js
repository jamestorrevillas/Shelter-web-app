// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
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

// Function to check if a pet with the same details already exists
async function doesPetExist(petName, petType, petAge, petColor, petWeight, petDays) {
    const petsRef = ref(database, 'pets');
    const snapshot = await get(petsRef);

    if (snapshot.exists()) {
        const pets = snapshot.val();
        return Object.values(pets).some((pet) => {
            return pet.name.toLowerCase() === petName.toLowerCase() &&
                   pet.type.toLowerCase() === petType.toLowerCase() &&
                   pet.age.toLowerCase() === petAge.toLowerCase() &&
                   pet.color.toLowerCase() === petColor.toLowerCase() &&
                   pet.weight.toLowerCase() === petWeight.toLowerCase() &&
                   pet.daysAtShelter.toLowerCase() === petDays.toLowerCase();
        });
    }

    return false;
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

    const petAlreadyExists = await doesPetExist(petName, petType, petAge, petColor, petWeight, petDays);

    if (petAlreadyExists) {
        alert('Error: This pet already exists.');
        return;
    }

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
            imageUrl: downloadURL,
            status: petStatus
        };

        // Push the pet data to the "pets" node in the database
        const newPetRef = push(ref(database, 'pets'));
        return set(newPetRef, petData);
    }).then(() => {
        window.location.href = 'pets.html';
    }).catch((error) => {
        console.error('Error adding pet to the database:', error.message);
    });
}

// Event listener for the "ADD PET" button
document.getElementById('addPetBtn').addEventListener('click', addPet);

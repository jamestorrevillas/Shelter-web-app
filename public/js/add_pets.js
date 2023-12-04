import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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



document.getElementById('addPetBtn').addEventListener('click', async (event) => {
    event.preventDefault();

    var petImage = document.getElementById('petImage').files[0];
    var petName = document.getElementById('petName').value;
    var petType = document.getElementById('petType').value;
    var petAge = document.getElementById('petAge').value;
    var petColor = document.getElementById('petColor').value;
    var petWeight = document.getElementById('petWeight').value;
    var petDays = document.getElementById('petDays').value;
    var petDescription = document.getElementById('petDescription').value;

    if (!petName || !petType || !petAge || !petColor || !petWeight || !petDays || !petDescription || !petImage) {
        alert('Please fill in all the pet details');
        return;
    }

    const formattedDays = new Date(petDays).toISOString();
    const petId = generateUniqueId();

    try {
        await saveImageToStorage(petImage, petId);
        const imageUrl = await getDownloadURL(storageRef(getStorage(app), `pet_images/${petId}`));

        const petDetails = {
            petImage: imageUrl,
            petName: petName,
            petType: petType,
            petAge: petAge,
            petColor: petColor,
            petWeight: petWeight,
            petDays: formattedDays,
            petDescription: petDescription
        };

        await set(ref(database, `pets/${petId}`), petDetails);

        alert('Pet added successfully!');
        window.location.href = 'pets.html';
    } catch (error) {
        console.error('Error adding pet:', error.message);

        if (error.code === 'storage/unauthorized') {
            alert('Error: Unauthorized access to storage. Please check your permissions.');
        } else {
            alert('Error adding pet. Please try again. Check the console for more details.');
        }
    }
});


function generateUniqueId() {
    const randomString = Math.random().toString(36).substring(2);
    const timestamp = (new Date()).getTime().toString(36);
    const uniqueId = randomString + timestamp;
    console.log('Generated ID:', uniqueId);
    return uniqueId;
}

function saveImageToStorage(image, petId) {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const storageRef = storageRef(storage, `pet_images/${petId}`);

        uploadBytes(storageRef, image)
            .then(snapshot => {
                getDownloadURL(storageRef)
                    .then(downloadURL => resolve(downloadURL))
                    .catch(error => reject(error));
            })
            .catch(error => {
                console.error('Error uploading image:', error.message);
                reject(error);
            });
            
    });
}

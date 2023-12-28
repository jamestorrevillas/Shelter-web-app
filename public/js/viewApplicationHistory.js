// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

function getApplicationIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('applicationId');
}

async function displayApplicationData(applicationId) {
    const applicationSnapshot = await get(ref(database, `applicationform/${applicationId}`));
    const applicationData = applicationSnapshot.val();

    if (applicationData) {
        // Fetch adopter details
        const adopterSnapshot = await get(ref(database, `adopters/${applicationData.adopter_id}`));
        const adopterData = adopterSnapshot.val();

        // Fetch pet details using pet_id
        const petSnapshot = await get(ref(database, `pets/${applicationData.pet_id}`));
        const petData = petSnapshot.val();

        // Update the HTML elements with the application data
        document.getElementById('PetName').value = petData ? petData.name : '';
        document.getElementById('AdopterName').value = `${adopterData.first_name || ''} ${adopterData.last_name || ''}`;
        document.getElementById('ShelterEmail').value = adopterData.email || '';
        document.getElementById('Address').value = adopterData.address || '';
        document.getElementById('ContactNumber').value = adopterData.phone_number || '';
        document.getElementById('Reason').value = applicationData.reason || '';

        // Fetch and display pet image
        if (petData && petData.imageUrl) {
            try {
                const imageUrl = await getDownloadURL(storageRef(storage, petData.imageUrl));
                document.getElementById('pet_profile').src = imageUrl;
            } catch (error) {
                console.error('Error loading pet image:', error);
            }
        }
    }
}

const applicationId = getApplicationIdFromURL();

// Display the application data
if (applicationId) {
    displayApplicationData(applicationId);

} else {
    console.error('No application ID found in URL');
}

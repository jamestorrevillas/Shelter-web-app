// viewApplication.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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

const applicationId = getApplicationIdFromURL();

async function displayApplicationData(applicationId) {
    const applicationSnapshot = await get(ref(database, `applicationform/${applicationId}`));
    const applicationData = applicationSnapshot.val();

    if (applicationData) {
        const adopterSnapshot = await get(ref(database, `adopters/${applicationData.adopter_id}`));
        const adopterData = adopterSnapshot.val();

        const petSnapshot = await get(ref(database, `pets/${applicationData.pet_id}`));
        const petData = petSnapshot.val();

        document.getElementById('PetName').value = petData ? petData.name : '';
        document.getElementById('AdopterName').value = `${adopterData.first_name || ''} ${adopterData.last_name || ''}`;
        document.getElementById('ShelterEmail').value = adopterData.email || '';
        document.getElementById('Address').value = adopterData.address || '';
        document.getElementById('ContactNumber').value = adopterData.phone_number || '';
        document.getElementById('Reason').value = applicationData.reason || '';
        document.getElementById('shelterFeedback').value = applicationData.feedback || '';

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

function getApplicationIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('applicationId');
}

// Function to handle the confirm button click
async function confirmApplication() {
    if (!applicationId) {
        console.error('No application ID available for confirmation');
        return;
    }

    const updates = {};
    updates[`/applicationform/${applicationId}/send_confirmation`] = 1;

    try {
        await update(ref(database), updates);
        alert("Confirmation sent successfully.");
    } catch (error) {
        console.error('Error sending confirmation:', error);
        alert("Failed to send confirmation.");
    }
}

// Attach the event listener to the confirm button
document.addEventListener('DOMContentLoaded', () => {
    const confirmButton = document.getElementById("confirmButton");
    if (confirmButton) {
        confirmButton.addEventListener("click", confirmApplication);
    }
});

// Display the application data
if (applicationId) {
    displayApplicationData(applicationId);
} else {
    console.error('No application ID found in URL');
}

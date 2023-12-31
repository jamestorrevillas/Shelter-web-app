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

        // Update the HTML elements with the application data
        document.getElementById('PetName').value = petData ? petData.name : '';
        document.getElementById('PetType').value = petData.type || '';
        document.getElementById('PetColor').value = petData.color || '';
        document.getElementById('PetGender').value = petData.gender || '';
        document.getElementById('DateApproved').value = applicationData.date_approved || '';
        document.getElementById('AdopterName').value = `${adopterData.first_name || ''} ${adopterData.last_name || ''}`;
        document.getElementById('AdopterEmail').value = adopterData.email || '';
        document.getElementById('AdopterAddress').value = adopterData.address || '';
        document.getElementById('AdopterNumber').value = adopterData.phone_number || '';
        document.getElementById('Reason').value = applicationData.reason || '';

        // Fetch and display pet image
        if (petData && adopterData && petData.imageUrl && adopterData.profile_picture) {
            try {
                const imageUrl = await getDownloadURL(storageRef(storage, petData.imageUrl));
                document.getElementById('pet_profile').src = imageUrl;
                const profile_picture = await getDownloadURL(storageRef(storage, adopterData.profile_picture));
                document.getElementById('adopter_profile').src = profile_picture;
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

// Function to handle the cancel button click
async function cancelApplication() {
    if (!applicationId) {
        console.error('No application ID available for cancellation');
        return;
    }

    const updates = {};
    updates[`/applicationform/${applicationId}/remarks`] = -1;
    updates[`/applicationform/${applicationId}/status`] = 1;

    try {
        await update(ref(database), updates);
        alert("Application approval cancelled successfully.");

        // Redirect to another page after successful cancellation
        window.location.href = "pendings.html";
    } catch (error) {
        console.error('Error cancelling application approval:', error);
        alert("Failed to cancel application approval.");
    }
}

// Attach the event listeners to the buttons
document.addEventListener('DOMContentLoaded', () => {
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    if (confirmButton) {
        confirmButton.addEventListener("click", confirmApplication);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelApplication);
    }
});

// Display the application data
if (applicationId) {
    displayApplicationData(applicationId);
} else {
    console.error('No application ID found in URL');
}

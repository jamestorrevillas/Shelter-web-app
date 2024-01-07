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

const adoptersRef = ref(database, 'adopters');
const petsRef = ref(database, 'pets');
const applicationFormRef = ref(database, 'applicationform');

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
        document.getElementById('PetType').value = petData.type || '';
        document.getElementById('PetType').value = petData.type || '';
        document.getElementById('PetGender').value = petData.gender || '';
        document.getElementById('PetType').value = petData.type || '';
        document.getElementById('PetBreed').value = petData.breed || '';
        document.getElementById('PetAge').value = petData.age || '';
        document.getElementById('PetWeight').value = petData.weight || '';
        document.getElementById('PetDateArrived').value = petData.dateArrived || '';
        document.getElementById('PetDaysAtShelter').value = petData.daysAtShelter + ' day/s' || '';
        document.getElementById('DateApplied').value = applicationData.date_applied || '';
        document.getElementById('AdopterName').value = `${adopterData.first_name || ''} ${adopterData.last_name || ''}`;
        document.getElementById('AdopterEmail').value = adopterData.email || '';
        document.getElementById('AdopterAddress').value = adopterData.address || '';
        document.getElementById('AdopterNumber').value = adopterData.phone_number || '';
        document.getElementById('Reason').value = applicationData.reason || '';
        document.getElementById('AdopterPetOwned').value = applicationData.pets_owned || '';
        document.getElementById('AdopterResidenceStatus').value = applicationData.own_rent || '';
        document.getElementById('AdopterEmploymentStatus').value = applicationData.employment_status || '';
        document.getElementById('AdopterLivingEnvironment').value = applicationData.living_environment || '';
        document.getElementById('shelterFeedback').value = applicationData.feedback || '';

        // Fetch and display pet image
        if (petData && adopterData && petData.imageUrl && adopterData.profile_picture) {
            try {
                // const imageUrl = await getDownloadURL(storageRef(storage, petData.imageUrl));
                document.getElementById('pet_profile').src = petData.imageUrl;
                // const profile_picture = await getDownloadURL(storageRef(storage, adopterData.profile_picture));
                document.getElementById('adopter_profile').src = adopterData.profile_picture;
            } catch (error) {
                console.error('Error loading pet image:', error);
            }
        }
    }
}

async function updateApplicationStatus(applicationId, remarks) {
    const feedback = document.getElementById('shelterFeedback').value;
    let updateData = {
        status: remarks,
        feedback: feedback
    };

    // If approving, set the date_approved to the current date and update pet status
    if (remarks === 1) {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset()); // Adjust for local timezone
        updateData.date_approved = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Get pet_id from application data
        const applicationSnapshot = await get(ref(database, `applicationform/${applicationId}`));
        const applicationData = applicationSnapshot.val();
        const petId = applicationData.pet_id;

        // Update pet status
        const petUpdateData = { status: 1 }; // Assuming '1' signifies 'ADOPTED' or 'NOT AVAILABLE'
        await update(ref(database, `pets/${petId}`), petUpdateData);
    }

    // If disapproving, also set the status to "COMPLETED"
    if (remarks === 0) {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset()); // Adjust for local timezone
        updateData.date_disapproved = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        updateData.status = 1; // Assuming '1' signifies 'COMPLETED'
    }

    update(ref(database, `applicationform/${applicationId}`), updateData)
    .then(() => {
        let remarksStatus = remarks === 0 ? "disapproved" : "approved";
        alert(`Application has been ${remarksStatus}.`);
        window.location.href = './submissions.html';
    })
    .catch(error => {
        console.error('Error updating application:', error);
    });
}

// Function to update daysAtShelter for all pets
function updateDaysAtShelterForAllPets() {
    get(ref(database, 'pets')).then((snapshot) => {
        const petsData = snapshot.val();
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set time to start of the current day

        for (const petId in petsData) {
            if (Object.hasOwnProperty.call(petsData, petId)) {
                const pet = petsData[petId];

                const dateArrived = new Date(pet.dateArrived);
                dateArrived.setHours(0, 0, 0, 0); // Set time to start of the arrival day

                const daysAtShelter = Math.ceil((currentDate - dateArrived) / (24 * 60 * 60 * 1000));

                // Update daysAtShelter in the database
                update(ref(database, `pets/${petId}`), { daysAtShelter: daysAtShelter });
            }
        }
    }).catch((error) => {
        console.error("Error updating days at shelter:", error);
    });
}

// Schedule the update function to run periodically
// For example, to run every 24 hours (86400000 milliseconds)
setInterval(updateDaysAtShelterForAllPets, 86400000);

// Run the function initially on script load
updateDaysAtShelterForAllPets();


const applicationId = getApplicationIdFromURL();

// Display the application data
if (applicationId) {
    displayApplicationData(applicationId);

    // Event listeners for buttons
    document.getElementById('approveButton').addEventListener('click', () => updateApplicationStatus(applicationId, 1));
    document.getElementById('disapproveButton').addEventListener('click', () => updateApplicationStatus(applicationId, 0));
} else {
    console.error('No application ID found in URL');
}

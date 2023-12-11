// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const storage = getStorage(app);

// Reference to the logged-in shelter's node in the database
let loggedInShelterRef;

// Function to get the logged-in user's shelter ID
function getLoggedInShelterId() {
    const user = auth.currentUser;
    
    return user ? user.uid : null;
}

// Function to display shelter profile data
function displayShelterProfile() {
    // Listen to changes in authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            const loggedInShelterId = getLoggedInShelterId();
            loggedInShelterRef = ref(database, 'shelters/' + loggedInShelterId);

            // Continue with displaying the shelter profile
            onValue(loggedInShelterRef, (snapshot) => {
                const shelterData = snapshot.val();
                if (shelterData) {
                    // Assuming you have HTML elements with corresponding IDs
                    document.getElementById('editShelterName').value = shelterData.shelter_name;
                    document.getElementById('editAddress').value = shelterData.address;
                    document.getElementById('editContactPerson').value = shelterData.contact_person;
                    document.getElementById('editContactNumber').value = shelterData.contact_number;

                    // Update the profile picture
                    const profilePic = document.getElementById('profile-pic');
                    let profilePicURL = '';

                    if (shelterData.profile_picture) {
                        if (shelterData.profile_picture === 'NOT SET') {
                            // Display a default image if profile_picture is set to "NOT SET"
                            profilePicURL = '../images/default_profile_picture.png';
                        } else {
                            // Use the profile picture URL if available
                            profilePicURL = shelterData.profile_picture;
                        }
                    }

                    profilePic.src = profilePicURL;
                }
            });
        }
    });
}

// Function to toggle edit mode
function toggleEditMode() {
    const editShelterName = document.getElementById('editShelterName');
    const editAddress = document.getElementById('editAddress');
    const editContactPerson = document.getElementById('editContactPerson');
    const editContactNumber = document.getElementById('editContactNumber');
    const saveProfileBtn = document.getElementById('save-profile-btn');

    const isEditMode = editShelterName.readOnly;

    // Toggle read-only state of text fields
    editShelterName.readOnly = !isEditMode;
    editAddress.readOnly = !isEditMode;
    editContactPerson.readOnly = !isEditMode;
    editContactNumber.readOnly = !isEditMode;

    // Change button text based on edit mode
    saveProfileBtn.textContent = isEditMode ? 'SAVE CHANGES' : 'EDIT PROFILE';

    // If entering edit mode, focus on the first editable field
    if (!isEditMode) {
        editShelterName.focus();
    }
}

// Function to save changes to shelter profile
function saveChanges() {
    const editShelterName = document.getElementById('editShelterName');
    const editAddress = document.getElementById('editAddress');
    const editContactPerson = document.getElementById('editContactPerson');
    const editContactNumber = document.getElementById('editContactNumber');

    // Update the shelter profile data in the database
    const updateData = {
        shelter_name: editShelterName.value,
        address: editAddress.value,
        contact_person: editContactPerson.value,
        contact_number: editContactNumber.value
    };

    update(loggedInShelterRef, updateData);
}


// Function to handle changing the profile picture
function changeProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const storageRefPath = storageRef(storage, `shelter_profile_pictures/${file.name}`);

            uploadBytes(storageRefPath, file).then(() => {
                // Get the download URL from the storage reference
                return getDownloadURL(storageRefPath);
            }).then((url) => {
                // Update the profile_picture node in the database with the new imageURL
                update(loggedInShelterRef, { 'profile_picture': url });
            }).catch((error) => {
                console.error('Error uploading profile picture:', error);
            });
        }
    });

    input.click();
}



// Call the function to display shelter profile data when the page loads
displayShelterProfile();

// Add event listener to the "EDIT PROFILE" button
document.getElementById('save-profile-btn').addEventListener('click', () => {
    if (document.getElementById('save-profile-btn').textContent === 'EDIT PROFILE') {
        toggleEditMode();
    } else {
        saveChanges();
        toggleEditMode();
    }
});

// Add event listener to the "Change Profile Picture" button
document.getElementById('change-profile-pic-btn').addEventListener('click', changeProfilePicture);

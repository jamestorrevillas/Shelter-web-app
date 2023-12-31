import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
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
const storage = getStorage(app);

const params = new URLSearchParams(window.location.search);
const petId = params.get('id');

const petRef = ref(database, `pets/${petId}`);

const editPetForm = document.getElementById('editPetForm');

editPetForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const updatedPetDetails = {
    imageUrl: document.getElementById('petPic').src,
    name: document.getElementById('editPetName').value,
    type: document.getElementById('editPetType').value,
    gender: document.getElementById('editPetGender').value,
    age: document.getElementById('editPetAge').value,
    color: document.getElementById('editPetColor').value,
    weight: document.getElementById('editPetWeight').value,
    description: document.getElementById('editPetDescription').value,
  };

  update(petRef, updatedPetDetails);
    // .then(() => {
    //   alert('Pet details updated successfully!');
    // })
    // .catch((error) => {
    //   console.error('Error updating pet details:', error.message);
    // });
});


// Function to pre-fill the form with existing pet details
async function preFillForm(petDetails) {
  const editPetImage = document.getElementById('petPic');

  if (petDetails.imageUrl) {
    try {
      // Get the download URL for the image using the stored URL
      const imageUrl = await getDownloadURL(storageRef(storage, petDetails.imageUrl));

      // Set the src attribute of the editPetImage element
      editPetImage.src = imageUrl;
    } catch (error) {
      console.error('Error getting download URL for image:', error.message);
      // Handle the error (e.g., display a default image)
    }
  }

  document.getElementById('editPetName').value = petDetails.name || '';
  document.getElementById('editPetType').value = petDetails.type || '';
  
  document.getElementById('editPetGenderMale').checked = petDetails.gender === 'Male';
  document.getElementById('editPetGenderFemale').checked = petDetails.gender === 'Female';


  document.getElementById('editPetAge').value = petDetails.age || '';
  document.getElementById('editPetColor').value = petDetails.color || '';
  document.getElementById('editPetWeight').value = petDetails.weight || '';
  document.getElementById('editPetDescription').value = petDetails.description || '';
  // document.getElementById('editPetStatus').value = petDetails.status || '';
  // document.getElementById('editPetDays').value = petDetails.daysAtShelter || '';

  toggleEditMode(false);
}

// Fetch pet details from Firebase and pre-fill the form
onValue(petRef, (snapshot) => {
  const petDetails = snapshot.val();
  if (petDetails !== null) {
    preFillForm(petDetails);
  }
});

// Function to toggle edit mode
function toggleEditMode(isEditMode) {
  const editFields = [
    'editPetName', 'editPetType', 'editPetAge', 'editPetGender',
    'editPetColor', 'editPetWeight', 'editPetDescription'
  ];

  editFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.readOnly = !isEditMode;
    }
  });

  const savePetProfileBtn = document.getElementById('editPetBtn');
  savePetProfileBtn.textContent = isEditMode ? 'SAVE CHANGES' : 'EDIT PROFILE';

  // If entering edit mode, focus on the first editable field
  if (isEditMode) {
    document.getElementById('editPetName').focus();
  }
}

// Function to save changes to pet profile
function saveChanges() {
  const updateData = {
    name: document.getElementById('editPetName').value,
    type: document.getElementById('editPetType').value,
    gender: document.getElementById('editPetGender').value,
    age: document.getElementById('editPetAge').value,
    color: document.getElementById('editPetColor').value,
    weight: document.getElementById('editPetWeight').value,
    description: document.getElementById('editPetDescription').value,
  };

  update(petRef, updateData)
    .then(() => {
      alert('Pet details updated successfully!');
      toggleEditMode(false);  // Switch back to view mode after saving
    })
    .catch((error) => {
      console.error('Error updating pet details:', error.message);
    });
}
  

// Function to handle changing the pet's profile picture
function changePetProfilePicture() {
  const input = document.createElement('input');
  input.type = 'file';

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
      const storageRefPath = storageRef(storage, `pet_images/${file.name}`);

      uploadBytes(storageRefPath, file).then(() => {
        // Get the download URL from the storage reference
        return getDownloadURL(storageRefPath);
      }).then((url) => {
        // Update the profile_picture node in the database with the new imageURL
        update(petRef, { 'imageUrl': url });
      }).catch((error) => {
        console.error('Error uploading profile picture:', error);
      });
    }
  });

  input.click();
}

// Add event listener to the "EDIT PROFILE" button
document.getElementById('editPetBtn').addEventListener('click', () => {
  const isCurrentlyEdit = document.getElementById('editPetBtn').textContent === 'EDIT PROFILE';
  toggleEditMode(isCurrentlyEdit);
});

// Add event listener to the "Change Profile Picture" button for pets
document.getElementById('change-petpic-btn').addEventListener('click', changePetProfilePicture);
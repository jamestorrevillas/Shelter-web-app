// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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

const petsRef = ref(database, 'pets');

function displayPetData() {
    onValue(petsRef, (snapshot) => {
        const petsData = snapshot.val();
        const petsTableBody = document.getElementById('table-body-below');
        petsTableBody.innerHTML = '';

        const loggedInShelterId = getLoggedInShelterId();
        let petsArray = [];

        for (const petId in petsData) {
            if (Object.hasOwnProperty.call(petsData, petId)) {
                const pet = petsData[petId];

                if (pet.shelter_id && pet.shelter_id === loggedInShelterId && pet.status === -1) {
                    petsArray.push({ pet, petId });
                }
            }
        }
        // Sort the petsArray based on dateArrived in ascending order
        petsArray.sort((a, b) => new Date(a.pet.dateArrived) - new Date(b.pet.dateArrived));

        // Now display each pet
        petsArray.forEach(({ pet, petId }) => {
            displayNewPet(pet, petId);
        });
    });
}

function getLoggedInShelterId() {
    const user = auth.currentUser;

    return user ? user.uid : null;
}

function displayNewPet(petDetails, petId) {
    const tableBody = document.getElementById('table-body-below');

    const { name, type, dateArrived, status, imageUrl } = petDetails;

    const petName = name;
    const petType = type;
    const petDays = dateArrived;
    const petStatus = status;

    // const currentDate = new Date();
    // const daysAtShelter = Math.floor((currentDate - new Date(petDays)) / (24 * 60 * 60 * 1000));


    const tableRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.style.display = 'flex';
    nameCell.style.alignItems = 'center';

    const petImage = document.createElement('img');
    petImage.src = imageUrl;
    petImage.style.width = '50px'; 
    petImage.style.height = '50px';
    petImage.style.marginRight = '10px';

    nameCell.appendChild(petImage);
    nameCell.appendChild(document.createTextNode(name));

    const typeCell = document.createElement('td');
    typeCell.textContent = type;
    typeCell.style.display = 'flex';
    typeCell.style.alignItems = 'center';
    
    const daysCell = document.createElement('td');
    daysCell.textContent = dateArrived;
    daysCell.style.display = 'flex';
    daysCell.style.alignItems = 'center';

    const statusCell = document.createElement('td');
    statusCell.textContent = mapStatusValueToString(status);
    statusCell.style.display = 'flex';
    statusCell.style.alignItems = 'center';

    const button2 = document.createElement('td');
    const image2 = document.createElement('img');
    image2.src = "../images/pen_icon.png"; 

    image2.addEventListener('click', function() {
        window.location.href = `archive-view.html?id=${petId}&imageURL=${petDetails.imageURL}`;
    });
    button2.appendChild(image2);    


    const button1 = document.createElement('td');
            
    const image1 = document.createElement('img');
    image1.src = "../images/icons8-eye-50.png"; 
    
    image1.addEventListener('click', function() {
        archivePet(petId);
    });
    
    button1.appendChild(image1);    

    // Add table cells to the table row
    tableRow.appendChild(daysCell);
    tableRow.appendChild(nameCell);
    tableRow.appendChild(typeCell);
    tableRow.appendChild(statusCell);
    tableRow.appendChild(button2);
    tableRow.appendChild(button1);

    tableRow.classList.add('colored-row');

    tableBody.appendChild(tableRow);
    document.getElementById('search-bar').addEventListener('input', filterTable);
}


function filterTable() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const tableRows = document.querySelectorAll('.colored-row');

    tableRows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)');
        
        const nameMatch = nameCell.textContent.toLowerCase().includes(searchInput);
        
        if (nameMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to map numeric remark values to string
function mapStatusValueToString(statusValue) {
    switch (statusValue) {
        case -1: return "ARCHIVED";
        case 0: return "IN SHELTER";
        case 1: return "ADOPTED";
        default: return "Unknown";
    }
}

function updateDaysAtShelter() {
    const currentDate = new Date();

    // Iterate through each row in the table and update the 'daysAtShelter' cell
    const tableRows = document.querySelectorAll('.colored-row');

    tableRows.forEach(row => {
        const daysCell = row.querySelector('td:nth-child(6)'); // Assuming 'daysAtShelter' cell is the 6th cell

        // Retrieve the 'dateArrived' value from the row's dataset
        const dateArrived = new Date(row.dataset.dateArrived);
        const daysAtShelter = Math.floor((currentDate - dateArrived) / (24 * 60 * 60 * 1000));

        // Update the 'daysAtShelter' cell
        daysCell.textContent = daysAtShelter;
    });
}

function archivePet(petId) {
    const petRef = ref(database, `pets/${petId}`);
    update(petRef, { status: 0 })
        .then(() => {
            console.log('Pet archived successfully!');
            window.location.href = `archive.html?id=${petId}&imageURL=${petDetails.imageURL}`;
        })
        .catch((error) => {
            console.error('Error archiving pet:', error.message);
        });
}

updateDaysAtShelter();
setInterval(updateDaysAtShelter, 86400000);
displayPetData();

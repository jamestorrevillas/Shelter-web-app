// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
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

        for (const petId in petsData) {
            if (Object.hasOwnProperty.call(petsData, petId)) {
                const pet = petsData[petId];

                if (pet.shelter_id && pet.shelter_id === loggedInShelterId && pet.status !== 'completed' && pet.status !== 'ARCHIVED') {
                    displayNewPet(pet, petId);
                }
            }
        }
    });
}

function getLoggedInShelterId() {
    const user = auth.currentUser;

    return user ? user.uid : null;
}

function displayNewPet(petDetails, petId) {
    const tableBody = document.getElementById('table-body-below');

    const { name, age, weight, color, type, days_at_shelter, status, description } = petDetails;

    const petName = name;
    const petAge = age;
    const petWeight = weight;
    const petColor = color;
    const petType = type;
    const petDays = days_at_shelter;
    const petStatus = status;
    const petDescription = description;

    const tableRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = petName;
    const ageCell = document.createElement('td');
    ageCell.textContent = petAge;
    const weightCell = document.createElement('td');
    weightCell.textContent = petWeight;
    const colorCell = document.createElement('td');
    colorCell.textContent = petColor;
    const typeCell = document.createElement('td');
    typeCell.textContent = petType;
    const daysCell = document.createElement('td');
    daysCell.textContent = petDays;
    const statusCell = document.createElement('td');
    statusCell.textContent = petStatus;
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = petDescription;
   
                const button1 = document.createElement('td');
            
                const image1 = document.createElement('img');
                image1.src = "../images/pen_icon.png"; 
                
                image1.addEventListener('click', function() {
                    window.location.href = `editPetDetails.html?id=${petId}&imageURL=${petDetails.imageURL}`;
                });
                
                button1.appendChild(image1);    

    // Add table cells to the table row
    tableRow.appendChild(nameCell);
    tableRow.appendChild(ageCell);
    tableRow.appendChild(weightCell);
    // tableRow.appendChild(colorCell);
    // tableRow.appendChild(typeCell);
    tableRow.appendChild(daysCell);
    tableRow.appendChild(statusCell);
    tableRow.appendChild(button1);
    // tableRow.appendChild(descriptionCell);

    tableRow.classList.add('colored-row');

    tableBody.appendChild(tableRow);
    document.getElementById('search-bar').addEventListener('input', filterTable);
}

function filterTable() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const tableRows = document.querySelectorAll('.colored-row');

    tableRows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)');
        const statusCell = row.querySelector('td:nth-child(7)'); 

      
        const nameMatch = nameCell.textContent.toLowerCase().includes(searchInput);
        const statusMatch = statusCell.textContent.toLowerCase().includes(searchInput);

      
        if (nameMatch || statusMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

displayPetData();

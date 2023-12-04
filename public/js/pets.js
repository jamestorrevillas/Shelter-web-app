// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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
const storage = getStorage(app);

// Get reference to the 'pets' node in the database
const petsRef = ref(database, 'pets');

// Function to display pet data in a table format
function displayPetData() {
    onValue(petsRef, (snapshot) => {
        const petsData = snapshot.val();
        const petsTable = document.getElementById('pets-table');
        const tableBody = petsTable.getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing table rows

        for (const petId in petsData) {
            if (Object.hasOwnProperty.call(petsData, petId)) {
                const pet = petsData[petId];
                displayNewPet(pet, petId);
            }
        }
    });
}

// Function to display the newly added pet immediately on the page
function displayNewPet(petDetails, petId) {
    const tableBody = document.getElementById('table-body');

    // Create HTML elements for the new pet
    const tableRow = document.createElement('tr');

    // Create table cells for each pet detail
    const tableCells = [];
    for (const detail in petDetails) {
        if (Object.hasOwnProperty.call(petDetails, detail)) {
            const tableCell = document.createElement('td');
            tableCell.textContent = petDetails[detail];
            tableCells.push(tableCell);
        }
    }

    // Add table cells to the table row
    tableCells.forEach(cell => tableRow.appendChild(cell));

    // Append the table row to the table body
    tableBody.appendChild(tableRow);
}

// Call the function to display pet data when the page loads
displayPetData();

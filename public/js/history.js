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

const historyRef = ref(database, 'applicationform');

function displayHistoryData() {
    onValue(historyRef, (snapshot) => {
        const historyData = snapshot.val();
        const historyTableBody = document.getElementById('table-body-below');
        historyTableBody.innerHTML = '';

        const loggedInShelterId = getLoggedInShelterId();

        for (const applicationId in historyData) {
            if (Object.hasOwnProperty.call(historyData, applicationId)) {
                const application = historyData[applicationId];

                // Check if the application is linked with the current shelter user and has a status of "completed"
                if (application.shelter_id && application.shelter_id === loggedInShelterId && application.status === 'COMPLETED') {
                    displayApplication(application, applicationId);
                }
            }
        }
    });
}

function getLoggedInShelterId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

function displayApplication(applicationDetails, applicationId) {
    const tableBody = document.getElementById('table-body-below');

    const { pet_name, adopter_name, contact_number, address, status } = applicationDetails;

    const petName = pet_name;
    const adopterName = adopter_name;
    const contactNumber = contact_number;
    const adopterAddress = address;
    const applicationStatus = status;

    const tableRow = document.createElement('tr');

    const petNameCell = document.createElement('td');
    petNameCell.textContent = petName;
    const adopterNameCell = document.createElement('td');
    adopterNameCell.textContent = adopterName;
    const contactNumberCell = document.createElement('td');
    contactNumberCell.textContent = contactNumber;
    const addressCell = document.createElement('td');
    addressCell.textContent = adopterAddress;
    const statusCell = document.createElement('td');
    statusCell.textContent = applicationStatus;

    // Add table cells to the table row
    tableRow.appendChild(petNameCell);
    tableRow.appendChild(adopterNameCell);
    tableRow.appendChild(contactNumberCell);
    tableRow.appendChild(addressCell);
    tableRow.appendChild(statusCell);

    tableRow.classList.add('colored-row');

    tableBody.appendChild(tableRow);
    document.getElementById('search-bar').addEventListener('input', filterTable);
}

function filterTable() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const tableRows = document.querySelectorAll('.colored-row');

    tableRows.forEach(row => {
        const adopterNameCell = row.querySelector('td:nth-child(1)');
        const statusCell = row.querySelector('td:nth-child(4)');

        const adopterNameMatch = adopterNameCell.textContent.toLowerCase().includes(searchInput);
        const statusMatch = statusCell.textContent.toLowerCase().includes(searchInput);

        if (adopterNameMatch || statusMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

displayHistoryData();
// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
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

const adoptersRef = ref(database, 'adopters');
const sheltersRef = ref(database, 'shelters');
const applicationFormRef = ref(database, 'applicationform');

function displayApplicationsData() {
    onValue(applicationFormRef, (snapshot) => {
        const applicationsData = snapshot.val();
        const applicationsTableBody = document.getElementById('table-body-below');
        applicationsTableBody.innerHTML = '';

        const loggedInShelterId = getLoggedInShelterId();

        for (const applicationId in applicationsData) {
            if (Object.hasOwnProperty.call(applicationsData, applicationId)) {
                const application = applicationsData[applicationId];

                if (application.shelter_id && application.shelter_id === loggedInShelterId && application.status !== 1) {
                    displayApplicationDetails(application, applicationId);
                }
            }
        }
    });
}

function getLoggedInShelterId() {
    const user = auth.currentUser;

    return user ? user.uid : null;
}

async function displayApplicationDetails(application, applicationId) {
    const tableBody = document.getElementById('table-body-below');

    // Fetch adopter details
    const adopterDetails = await fetchUserData(adoptersRef, application.adopter_id);

    // Extract adopter details
    const { first_name, last_name, phone_number, email, address } = adopterDetails;

    // Extract other application details
    const { reason } = application;

    const tableRow = document.createElement('tr');

    const adopterNameCell = document.createElement('td');
    adopterNameCell.textContent = first_name + ' ' + last_name;

    const contactNumberCell = document.createElement('td');
    contactNumberCell.textContent = phone_number;

    const emailCell = document.createElement('td');
    emailCell.textContent = email;

    const addressCell = document.createElement('td');
    addressCell.textContent = address;

    const reasonCell = document.createElement('td');
    reasonCell.textContent = reason;

    // Add table cells to the table row
    tableRow.appendChild(addressCell);
    tableRow.appendChild(emailCell);
    tableRow.appendChild(adopterNameCell);
    tableRow.appendChild(contactNumberCell);
    // tableRow.appendChild(reasonCell);

    tableRow.classList.add('colored-row');

    // Create an anchor element
    const rowAnchor = document.createElement('a');
    rowAnchor.href = '#';
    rowAnchor.addEventListener('click', function() {
        window.location.href = `response.html?applicationId=${applicationId}`;
    });

    // Append the table row to the anchor element
    rowAnchor.appendChild(tableRow);

    // Append the anchor element to the table body
    tableBody.appendChild(rowAnchor);
    document.getElementById('search-bar').addEventListener('input', filterTable);
}


// Function to fetch user data from a specific node in the database
async function fetchUserData(nodeRef, userId) {
    try {
        const snapshot = await get(nodeRef);
        const userData = snapshot.child(userId).val();
        if (userData) {
            return userData;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        throw error;
    }
}

function filterTable() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const tableRows = document.querySelectorAll('.colored-row');

    tableRows.forEach(row => {
        const adopterNameCell = row.querySelector('td:nth-child(1)');
        const statusCell = row.querySelector('td:nth-child(5)');

        const adopterNameMatch = adopterNameCell.textContent.toLowerCase().includes(searchInput);
        const statusMatch = statusCell.textContent.toLowerCase().includes(searchInput);

        if (adopterNameMatch || statusMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

displayApplicationsData();
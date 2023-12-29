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
const petsRef = ref(database, 'pets');

function displayApplicationsData() {
    onValue(applicationFormRef, async (snapshot) => {
        const applicationsData = snapshot.val();
        const applicationsTableBody = document.getElementById('table-body-below');
        applicationsTableBody.innerHTML = '';

        const loggedInShelterId = getLoggedInShelterId();

        for (const applicationId in applicationsData) {
            if (Object.hasOwnProperty.call(applicationsData, applicationId)) {
                const application = applicationsData[applicationId];

                // Fetch pet details to get the shelter_id associated with the pet
                const petDetails = await fetchPetData(application.pet_id);

                // Check if the pet belongs to the logged-in shelter
                if (petDetails && petDetails.shelter_id === loggedInShelterId && application.status !== 1 && application.remarks !== 1 && application.remarks !== -1) {
                    displayApplicationDetails(application, applicationId);
                }
            }
        }
    });
}

// Function to fetch pet data from the database
async function fetchPetData(petId) {
    try {
        const petSnapshot = await get(ref(database, `pets/${petId}`));
        return petSnapshot.val();
    } catch (error) {
        console.error("Error fetching pet data:", error);
        return null;
    }
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
    const { reason, date_applied } = application;

    const daysAtPending = calculateDaysAtPending(date_applied);

    const tableRow = document.createElement('tr');

    const adopterNameCell = document.createElement('td');
    adopterNameCell.textContent = first_name + ' ' + last_name;

    // const contactNumberCell = document.createElement('td');
    // contactNumberCell.textContent = phone_number;
    
    const dateAppliedCell = document.createElement('td');
    dateAppliedCell.textContent = date_applied;

    const daysAtPendingCell = document.createElement('td');
    daysAtPendingCell.textContent = daysAtPending;

    // const emailCell = document.createElement('td');
    // emailCell.textContent = email;

    const addressCell = document.createElement('td');
    addressCell.textContent = address;

    // const reasonCell = document.createElement('td');
    // reasonCell.textContent = reason;

    // Add table cells to the table row
    tableRow.appendChild(adopterNameCell);
    tableRow.appendChild(addressCell);
    tableRow.appendChild(dateAppliedCell);
    tableRow.appendChild(daysAtPendingCell);
    // tableRow.appendChild(emailCell);
    // tableRow.appendChild(contactNumberCell);
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

// Function to calculate the number of days between the application date and the current date
function calculateDaysAtPending(dateApplied) {
    const currentDate = new Date();
    const applicationDate = new Date(dateApplied);
    const timeDiff = currentDate.getTime() - applicationDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

displayApplicationsData();
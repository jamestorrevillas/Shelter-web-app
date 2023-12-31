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

        let applicationsArray = [];

        for (const applicationId in applicationsData) {
            if (applicationsData.hasOwnProperty(applicationId)) {
                const application = applicationsData[applicationId];

                const petDetails = await fetchPetData(application.pet_id);

                if (petDetails && petDetails.shelter_id === loggedInShelterId && application.status === 0 || application.remarks === 1 && application.remarks === 2) {
                    const adopterDetails = await fetchUserData(adoptersRef, application.adopter_id);
                    applicationsArray.push({ application, applicationId, adopterDetails });
                }
            }
        }

        // Sort applications by date_approved in descending order
        applicationsArray.sort((a, b) => new Date(b.application.date_approved) - new Date(a.application.date_approved));

        // Display each application
        applicationsArray.forEach(({ application, applicationId, adopterDetails }) => {
            displayApplicationDetails(application, applicationId, adopterDetails);
        });
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

    // Fetch pet details using pet_id
    const petDetails = await fetchUserData(petsRef, application.pet_id);

    // Extract pet details
    const { name, imageUrl, type } = petDetails;

    // Extract adopter details
    const { first_name, last_name, address, profile_picture } = adopterDetails;

    // Extract other application details
    const { date_approved } = application;

    const tableRow = document.createElement('tr');

    const dateApprovedCell = document.createElement('td');
    dateApprovedCell.textContent = date_approved;
    dateApprovedCell.style.display = 'flex';
    dateApprovedCell.style.alignItems = 'center';

    const profilePicture = document.createElement('img');
    profilePicture.src = profile_picture; 
    profilePicture.style.width = '50px'; 
    profilePicture.style.height = '50px';
    profilePicture.style.marginRight = '10px';

    const adopterNameCell = document.createElement('td');
    adopterNameCell.style.display = 'flex';
    adopterNameCell.style.alignItems = 'center';

    adopterNameCell.appendChild(profilePicture);
    adopterNameCell.appendChild(document.createTextNode(first_name + ' ' + last_name));
    
    const addressCell = document.createElement('td');
    addressCell.textContent = address;
    addressCell.style.display = 'flex';
    addressCell.style.alignItems = 'center';

    const petImage = document.createElement('img');
    petImage.src = imageUrl; 
    petImage.style.width = '50px'; 
    petImage.style.height = '50px';
    petImage.style.marginRight = '10px';

    const petNameCell = document.createElement('td');
    petNameCell.style.display = 'flex';
    petNameCell.style.alignItems = 'center';

    const petTypeCell = document.createElement('td');
    petTypeCell.textContent = type;
    petTypeCell.style.display = 'flex';
    petTypeCell.style.alignItems = 'center';

    petNameCell.appendChild(petImage);
    petNameCell.appendChild(document.createTextNode(name));

    // Add table cells to the table row
    tableRow.appendChild(dateApprovedCell);
    tableRow.appendChild(adopterNameCell);
    tableRow.appendChild(addressCell);
    tableRow.appendChild(petNameCell);
    tableRow.appendChild(petTypeCell);

    tableRow.classList.add('colored-row');

    // Create an anchor element
    const rowAnchor = document.createElement('a');
    rowAnchor.href = '#';
    rowAnchor.style.textDecoration = 'none'; // Remove underline
    rowAnchor.style.color = 'inherit'; // Keep text color consistent
    rowAnchor.addEventListener('click', function() {
        window.location.href = `approved-application-view.html?applicationId=${applicationId}`;
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
        // Retrieve the text content of each column in the row
        const dateApproved = row.cells[0].textContent.toLowerCase(); 
        const adopterName = row.cells[1].textContent.toLowerCase(); 
        const address = row.cells[2].textContent.toLowerCase(); 
        const petName = row.cells[3].textContent.toLowerCase(); 
        const petType = row.cells[4].textContent.toLowerCase(); 

        // Check if the search input matches any of these text contents
        if (dateApproved.includes(searchInput) || adopterName.includes(searchInput) || address.includes(searchInput) || petName.includes(searchInput) || petType.includes(searchInput)) {
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
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebase configuration
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

        for (const uid in historyData) {
            if (historyData.hasOwnProperty(uid)) {
                const entry = historyData[uid];
                if (entry.shelter_id === loggedInShelterId && entry.status === 1) {
                    displayHistoryEntry(entry, uid);
                }
            }
        }
    });
}


function getLoggedInShelterId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

async function displayHistoryEntry(historyDetails, applicationId) {
    const tableBody = document.getElementById('table-body-below');

    // Fetch pet name using pet_id
    const petSnapshot = await get(ref(database, `pets/${historyDetails.pet_id}`));
    const petData = petSnapshot.val();
    const petName = petData ? petData.name : 'No Pet Name';

    // Fetch adopter details using adopter_id
    const adopterSnapshot = await get(ref(database, `adopters/${historyDetails.adopter_id}`));
    const adopterData = adopterSnapshot.val();
    const adopterName = `${adopterData.first_name || ''} ${adopterData.last_name || ''}`; 
    const contactNumber = adopterData.phone_number || 'No Contact Number'; 
    const address = adopterData.address || 'No Address';

    const tableRow = document.createElement('tr');

    const petNameCell = document.createElement('td');
    petNameCell.textContent = petName;
    const adopterNameCell = document.createElement('td');
    adopterNameCell.textContent = adopterName;
    const contactNumberCell = document.createElement('td');
    contactNumberCell.textContent = contactNumber;
    const addressCell = document.createElement('td');
    addressCell.textContent = address;
    const remarksCell = document.createElement('td');
    remarksCell.textContent = historyDetails.remarks;

    tableRow.appendChild(petNameCell);
    tableRow.appendChild(adopterNameCell);
    tableRow.appendChild(contactNumberCell);
    tableRow.appendChild(addressCell);
    tableRow.appendChild(remarksCell);

    tableRow.classList.add('colored-row');

    const rowAnchor = document.createElement('a');
    rowAnchor.href = '#'; 
    rowAnchor.addEventListener('click', function() {
        window.location.href = `viewApplication.html?applicationId=${applicationId}`;
    });

   // Append the table row to the anchor element
   rowAnchor.appendChild(tableRow);

   // Append the anchor element to the table body
   tableBody.appendChild(rowAnchor);
    //search bar
   document.getElementById('search-bar').addEventListener('input', filterTable);
   document.getElementById('remarks-filter').addEventListener('change', filterByRemarks);
}
function filterByRemarks() {
    const selectedRemark = document.getElementById('remarks-filter').value.toLowerCase();
    const tableRows = document.querySelectorAll('.colored-row');

    tableRows.forEach(row => {
        const remarksCell = row.querySelector('td:nth-child(5)'); // Change to 5 if the Remarks column is the fifth column
        const remarksText = remarksCell.textContent.trim().toLowerCase(); // Trim to remove leading/trailing spaces

        // Check if the remarksText is exactly equal to the selectedRemark (case-insensitive)
        const remarksMatch = remarksText === selectedRemark;

        if (remarksMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
function filterTable() {
    const searchInput = document.getElementById('search-bar').value.trim().toLowerCase();
    const tableRows = document.querySelectorAll('.colored-row');

    tableRows.forEach(row => {
        const adopterNameCell = row.querySelector('td:nth-child(1)');
       

        const adopterNameMatch = adopterNameCell.textContent.trim().toLowerCase().includes(searchInput);
       
        // Show the row only if there's a match in adopter name or remarks
        if (adopterNameMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

displayHistoryData();


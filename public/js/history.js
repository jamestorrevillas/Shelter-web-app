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
                if (entry.shelter_id === loggedInShelterId && entry.status === 'COMPLETED') {
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

async function displayHistoryEntry(historyDetails, uid) {
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

    tableBody.appendChild(tableRow);
}

displayHistoryData();


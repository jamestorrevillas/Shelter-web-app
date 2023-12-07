    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

    // Get reference to the 'pets' node in the database
    const petsRef = ref(database, 'pets');

// Function to display pet data in a table format
function displayPetData() {
    onValue(petsRef, (snapshot) => {
        const petsData = snapshot.val();
        const petsTableBody = document.getElementById('table-body-below');
        petsTableBody.innerHTML = ''; // Clear existing table rows

        

        onValue(petsRef, (snapshot) => {
            const petsData = snapshot.val();
            const petsTableBody = document.getElementById('table-body');
            petsTableBody.innerHTML = ''; // Clear existing table rows

            for (const petId in petsData) {
                if (Object.hasOwnProperty.call(petsData, petId)) {
                    const pet = petsData[petId];
                    displayNewPet(pet, petId);
                }
            }
        }
    });
}

// Function to display the newly added pet immediately on the page
function displayNewPet(petDetails, petId) {
    const tableBody = document.getElementById('table-body-below');

    // Extract individual fields from petDetails
    const { name, age, weight, color, type, daysAtShelter, description} = petDetails;

    // Store each field in separate variables
    const petName = name;
    const petAge = age;
    const petWeight = weight;
    const petColor = color;
    const petType = type;
    const petDays = daysAtShelter;
    const petDescription = description;
    // Add other variables for additional fields

    // Create HTML elements for the new pet
    const tableRow = document.createElement('tr');

    // Create table cells for each pet detail
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
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = petDescription;
    // Add other cells for additional fields

    // Add table cells to the table row
    tableRow.appendChild(nameCell);
    tableRow.appendChild(ageCell);
    tableRow.appendChild(weightCell);
    // tableRow.appendChild(colorCell);
    // tableRow.appendChild(typeCell);
    tableRow.appendChild(daysCell);
    tableRow.appendChild(descriptionCell);
    // Add other cells for additional fields

        const displayOrder = ['petImage', 'petName', 'petType', 'petDays'];

        const tableCells = displayOrder.map(detail => {
            const tableCell = document.createElement('td');
            tableCell.textContent = petDetails[detail] || '';
            return tableCell;
        });

        // Append the cells directly to the row
        tableCells.forEach(cell => tableRow.appendChild(cell));

        tableBody.appendChild(tableRow);
    }

    // Call the function to display pet data when the page loads
    displayPetData();

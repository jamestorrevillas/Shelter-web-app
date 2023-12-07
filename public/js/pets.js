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
            const petsTableBody = document.getElementById('table-body');
            petsTableBody.innerHTML = ''; // Clear existing table rows

            for (const petId in petsData) {
                if (Object.hasOwnProperty.call(petsData, petId)) {
                    const pet = petsData[petId];
                    displayNewPet(pet, petId);
                }
            }
        });
    }

    // Function to display the newly added pet immediately on the page
    // Function to display the newly added pet immediately on the page
    function displayNewPet(petDetails, petId) {
        const tableBody = document.getElementById('table-body');
        const tableRow = document.createElement('tr');

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
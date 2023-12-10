// Import the functions you need from the Firebase SDK
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
const applicationformRef = ref(database, 'applicationform');
 
// Function to display pet data in a table format
function displayApplicationData() {
    onValue(applicationformRef, (snapshot) => {
        const applicationData = snapshot.val();
        const applicationTableBody = document.getElementById('table-body-below');
        applicationTableBody.innerHTML = '';
 
        for (const fullname in applicationData) {
            if (Object.hasOwnProperty.call(applicationData, fullname)) {
                const application = applicationData[fullname];
                displayNewApplication(application, fullname);
            }
        }
 
    });
}
 
// Function to display the newly added pet immediately on the page
// Function to display the newly added pet immediately on the page
function displayNewApplication(applicationDetails) {
    const tableBody = document.getElementById('table-body-below');
 
    // Extract individual fields from petDetails
    const {address, email, fullname, phonenum, reason} = applicationDetails;
 
    // Store each field in separate variables
    const adopterAddress = address;
    const adopterEmail = email;
    const adopterFullname = fullname;
    const adopterPhoneNum = phonenum;
    const adopterReason = reason;
    
 
    // Create HTML elements for the new pet
    const tableRow = document.createElement('tr');
 
    // Create table cells for each pet detail
    const addressCell = document.createElement('td');
    addressCell.textContent = adopterAddress;
    const emailCell = document.createElement('td');
    emailCell.textContent = adopterEmail;
    const fullnameCell = document.createElement('td');
    fullnameCell.textContent = adopterFullname;
    const phonenumCell = document.createElement('td');
    phonenumCell.textContent = adopterPhoneNum;
    const reasonCell = document.createElement('td');
    reasonCell.textContent = adopterReason;
    
    // const daysCell = document.createElement('td');
    // daysCell.textContent = petDays;
    // const statusCell = document.createElement('td');
    // statusCell.textContent = petStatus;
    // const descriptionCell = document.createElement('td');
    // descriptionCell.textContent = petDescription;

    // const button1 = document.createElement('td');
 
    // const image1 = document.createElement('img');
    // image1.src = "../images/pen_icon.png"; 
    
    // image1.addEventListener('click', function() {
    //     window.location.href = `editPetDetails.html?id=${petId}&imageURL=${petDetails.imageURL}`;
    // });
    
    // button1.appendChild(image1);    
 
 
    // Add table cells to the table row
    tableRow.appendChild(addressCell);
    tableRow.appendChild(emailCell);
    tableRow.appendChild(fullnameCell);
    tableRow.appendChild(phonenumCell);
    tableRow.appendChild(reasonCell);
    // tableRow.appendChild(button1);
    // Add other cells for additional fields
 
    tableRow.classList.add('colored-row');
 
    // Append the table row to the table body
    const rowButton = document.createElement('a');
    rowButton.href = '#';  // Set the desired URL or use '#' for placeholder
    rowButton.addEventListener('click', function() {
        window.location.href = 'response.html';
       
    });

    rowButton.appendChild(tableRow);

    // Append the anchor element to the table body
    tableBody.appendChild(rowButton);
}
 
// Call the function to display pet data when the page loads
displayApplicationData();   
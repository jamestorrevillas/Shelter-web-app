  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();

  // Function to handle the registration process
  function handleRegistration() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var sheltername = document.getElementById('sheltername').value;
    var address = document.getElementById('address').value;
    var contactPerson= document.getElementById('contactPerson').value;
    var contactnum= document.getElementById('contactnum').value;
    
    var profile_picture = "NOT SET";

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;

            set(ref(database, 'shelters/' + user.uid),{
                shelter_id: user.uid,
                email: email,
                shelter_name: sheltername,
                address: address,
                contact_person: contactPerson,
                contact_number: contactnum,
                password: password,
                profile_picture: profile_picture
            });
            alert('user created!');
            window.location.href = 'login.html';
        })    
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
}

// Add click event listener to the signUp button
signUp.addEventListener('click', handleRegistration);

// Add keypress event listener to input fields
document.getElementById('email').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        handleRegistration();
    }
});

document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        handleRegistration();
    }
});
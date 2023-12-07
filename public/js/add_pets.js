// Initialize Firebase
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

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const storage = firebase.storage(); 
  
  function save() {
      var petImage = document.getElementById('petImage').files[0];
      var petName = document.getElementById('petName').value;
      var petType = document.getElementById('petType').value;
      var petAge = document.getElementById('petAge').value;
      var petColor = document.getElementById('petColor').value;
      var petWeight = document.getElementById('petWeight').value;
      var petDays = document.getElementById('petDays').value;
      var petDescription = document.getElementById('petDescription').value;
  
      // Generate a unique ID for the pet
      var pet_id = database.ref().child('pets').push().key;
  
      // Upload image to Firebase Storage
      var storageRef = storage.ref('pet_images/' + pet_id);
      var uploadTask = storageRef.put(petImage);
  
      uploadTask.on('state_changed',
          function (snapshot) {
              // Observe state change events such as progress, pause, and resume
          },
          function (error) {
              // Handle unsuccessful uploads
              console.error('Error uploading image:', error);
          },
          function () {
              // Handle successful uploads on complete
              // For example, get the download URL: https://firebasestorage.googleapis.com/...
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                  // Save pet data to the database
                  database.ref('pets/' + petName).set({
                      petImage: downloadURL,
                      petName: petName,
                      petType: petType,
                      petColor: petColor,
                      petWeight: petWeight,
                      petDays: petDays,
                      petDescription: petDescription
                  });
  
                  alert('Pet Saved to DATABASE');
              });
          }
      );
  }
  document.getElementById('addPetBtn').addEventListener('click', save);
function displayPetDetails() {
    const petDetailsString = localStorage.getItem('newPet');

    if (petDetailsString) {
        const petDetails = JSON.parse(petDetailsString);

        const petDetailsContainer = document.getElementById('petDetailsContainer');
        petDetailsContainer.innerHTML = `
            <h2>Pet Details</h2>
            <p>Name: ${petDetails.name}</p>
            <p>Type: ${petDetails.type}</p>
            <p>Age: ${petDetails.age}</p>
            <p>Color: ${petDetails.color}</p>
            <p>Weight: ${petDetails.weight}</p>
            <p>Days at Shelter: ${petDetails.days}</p>
            <p>Description: ${petDetails.description}</p>
        `;
    }
}

window.onload = displayPetDetails;
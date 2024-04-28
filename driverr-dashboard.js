document.getElementById('shareLocation').addEventListener('click', function() {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(uploadLocation, showError, {
            maximumAge: 0,
            timeout: 5000,
            enableHighAccuracy: true
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function uploadLocation(position) {
    const { latitude, longitude } = position.coords;
    updateLocationInFirebase(latitude, longitude);
}

function updateLocationInFirebase(latitude, longitude) {
    var databaseRef = firebase.database().ref('drivers/{driverId}/location');
    databaseRef.set({
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString()
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        default:
            console.log("An unknown error occurred.");
            break;
    }
}

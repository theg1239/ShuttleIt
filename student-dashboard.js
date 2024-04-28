let map;
let markers = {};

function fetchDriverLocations() {
    const locationRef = firebase.database().ref('driverLocations');

    locationRef.on('value', function(snapshot) {
        const locations = snapshot.val();
        console.log("Received locations:", locations); 
        for (let driverId in locations) {
            const driverLocation = locations[driverId];
            if (driverLocation && driverLocation.latitude && driverLocation.longitude) {
                updateMap(driverId, driverLocation.latitude, driverLocation.longitude);
            } else {
                console.error(`Invalid or no location data available for ${driverId}.`);
            }
        }
    });
}

function updateMap(driverId, latitude, longitude) {

    if (markers[driverId]) {

        markers[driverId].setLatLng([latitude, longitude]);
    } else {

        markers[driverId] = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(driverId); 
    }

    map.panTo([latitude, longitude]);
}

document.addEventListener('DOMContentLoaded', function() {

    map = L.map('map').setView([12.973977, 79.163368], 16); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetchDriverLocations();
});

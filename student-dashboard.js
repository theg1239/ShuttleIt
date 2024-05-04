let map;
let markers = {};

var shuttleIcon = L.icon({
    iconUrl: '/assets/shuttle-icon.png',
    iconSize: [38, 38],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

function fetchDriverLocations() {
    console.log('Fetching driver locations...');
    fetch('/updated-locations')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                console.log('Received locations:', data.data);
                data.data.forEach(location => {
                    if (location && location.latitude && location.longitude) {
                        updateMap(location.driverId, location.latitude, location.longitude);
                    } else {
                        console.error(`Invalid or no location data available for driver ID: ${location.driverId}`);
                    }
                });
            } else {
                console.log("No locations found or error in response.");
            }
        })
        .catch(error => {
            console.error('Failed to fetch driver locations:', error);
        });
}

function updateMap(driverId, latitude, longitude) {
    console.log(`Updating map for driver: ${driverId}, Lat: ${latitude}, Lng: ${longitude}`);
    if (markers[driverId]) {
        markers[driverId].setLatLng([latitude, longitude]);
        console.log(`Moved marker for driver: ${driverId}`);
    } else {
        markers[driverId] = L.marker([latitude, longitude], { icon: shuttleIcon, title: driverId }).addTo(map);
        console.log(`Created marker for driver: ${driverId}`);
    }
}

function initMap() {
    map = L.map('map').setView([12.973977, 79.163368], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetchDriverLocations();
    setInterval(fetchDriverLocations, 5000);  // Fetch location updates every 5 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

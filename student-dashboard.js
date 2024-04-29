import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCe23F3CFtz-lbBFxXdjfv-z5oE9PhlyzE",
    authDomain: "shuttle-web-538fa.firebaseapp.com",
    databaseURL: "https://shuttle-web-538fa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shuttle-web-538fa",
    storageBucket: "shuttle-web-538fa.appspot.com",
    messagingSenderId: "189496484474",
    appId: "1:189496484474:web:d8929149d890cf573ad1c3",
    measurementId: "G-M20NXLPBD3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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
    const locationRef = ref(database, 'driverLocations');

    onValue(locationRef, (snapshot) => {
        const locations = snapshot.val();
        console.log('Received locations:', locations);
        if (!locations) {
            console.log("No locations found in database.");
            return;
        }
        Object.keys(locations).forEach(driverId => {
            const location = locations[driverId];
            console.log(`Updating location for driver: ${driverId}`);
            if (location && location.latitude && location.longitude) {
                updateMap(driverId, location.latitude, location.longitude);
            } else {
                console.error(`Invalid or no location data available for ${driverId}.`);
            }
        });
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
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

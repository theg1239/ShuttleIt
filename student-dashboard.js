// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define the map and markers globally
let map;
let markers = {};

// Function to fetch and listen for driver locations from Firebase
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
            }   else {
                console.error(`Invalid or no location data available for ${driverId}.`);
            }
        });
    });
}

// Function to update the map with the new location
function updateMap(driverId, latitude, longitude) {
    console.log(`Updating map for driver: ${driverId}, Lat: ${latitude}, Lng: ${longitude}`);
    if (markers[driverId]) {
        markers[driverId].setLatLng([latitude, longitude]);
        console.log(`Moved marker for driver: ${driverId}`);
    } else {
        markers[driverId] = L.marker([latitude, longitude], { title: driverId }).addTo(map);
        console.log(`Created marker for driver: ${driverId}`);
    }
    map.panTo([latitude, longitude]);
}

// Initialize the map and add tile layer
function initMap() {
    map = L.map('map').setView([12.973977, 79.163368], 16); // Coordinates for VIT Vellore
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fetch driver locations
    fetchDriverLocations();
}

// Listen for the DOM content loaded event and initialize the map
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

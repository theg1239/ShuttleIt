let isSharingLocation = false;
let shareLocationInterval;
let lastLocationUpdateTimestamp = null; // Store the last location update timestamp

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
firebase.initializeApp(firebaseConfig);

// Reference to your Firebase database location for the driver's location
const locationRef = firebase.database().ref('driverLocation');

// Function to update the driver's location in Firebase
function updateDriverLocation() {
  const driverId = firebase.auth().currentUser.uid;
  const locationRef = firebase.database().ref(`driverLocations/${driverId}`);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const locationUpdate = {
                latitude: latitude,
                longitude: longitude,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            locationRef.set(locationUpdate);
            console.log('Location updated:', locationUpdate);
            // Update the last location update timestamp whenever location is updated
            lastLocationUpdateTimestamp = Date.now();
        }, (error) => {
            console.error('Error getting location:', error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Function to start sharing the driver's location
function startSharingLocation() {
    if (!isSharingLocation) {
        isSharingLocation = true;
        updateDriverLocation(); // Immediately get and send location
        shareLocationInterval = setInterval(updateDriverLocation, 5000); // Then continue every 5 seconds
        console.log('Location sharing started.');
        document.getElementById('shareLocationBtn').style.backgroundColor = '#4CAF50'; // Change to green
    }
}

// Function to stop sharing the driver's location
function stopSharingLocation() {
    if (isSharingLocation) {
        isSharingLocation = false;
        clearInterval(shareLocationInterval); // Stop the interval
        console.log('Location sharing stopped.');
        document.getElementById('shareLocationBtn').style.backgroundColor = ''; // Revert to default
    }
}

// Toggle the location sharing state
function toggleLocationSharing() {
    isSharingLocation ? stopSharingLocation() : startSharingLocation();
}

// Function to update the last location update time display
function updateLastLocationTime() {
    if (lastLocationUpdateTimestamp) {
        const now = Date.now();
        const secondsSinceLastUpdate = Math.round((now - lastLocationUpdateTimestamp) / 1000);
        document.getElementById('lastUpdateTime').textContent = `${secondsSinceLastUpdate}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the driver's username from localStorage
    var driverUsername = localStorage.getItem('driverUsername');
    
    // Set the driver's username in the dashboard
    if(driverUsername) {
        document.getElementById('driverName').textContent = `Logged in as ${driverUsername}`;
    }

    // Initialize the driver dashboard
    initDriverDashboard();
});

function initDriverDashboard() {
    const shareLocationBtn = document.getElementById('shareLocationBtn');
    shareLocationBtn.addEventListener('click', toggleLocationSharing);

    locationRef.on('value', (snapshot) => {
        const locationData = snapshot.val();
        if (locationData && locationData.timestamp) {
            // Update the last location timestamp
            lastLocationUpdateTimestamp = locationData.timestamp;
            // Immediately update the display
            updateLastLocationTime();
        }
    });

    // Update the last location time every second
    setInterval(updateLastLocationTime, 1000);
}
const driverName = localStorage.getItem('driverUsername');

if (driverName) {
  const driverNameSpan = document.getElementById('driverName');
  if (driverNameSpan) {
    driverNameSpan.textContent = driverName; // Set the driver's name
  }
}

// Firebase configuration and initialization
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
firebase.initializeApp(firebaseConfig);

// Global variables for tracking state
let isSharingLocation = false;
let shareLocationInterval;
let lastLocationUpdateTimestamp = null;

// Function definitions
function updateDriverLocation() {
    const user = firebase.auth().currentUser;
    if (user) {
        const driverId = user.uid;
        const locationRef = firebase.database().ref(`driverLocations/${driverId}`);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const locationUpdate = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };
                locationRef.set(locationUpdate);
                console.log('Location updated:', locationUpdate);
                lastLocationUpdateTimestamp = Date.now();
            }, error => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    } else {
        console.error("User is not authenticated. Can't update location.");
    }
}
const driverName = localStorage.getItem('driverUsername');

if (driverName) {
    const driverNameSpan = document.getElementById('driverName');
    if (driverNameSpan) {
        driverNameSpan.textContent = driverName;
    }
}
function startSharingLocation() {
    if (!isSharingLocation) {
        isSharingLocation = true;
        updateDriverLocation();
        shareLocationInterval = setInterval(updateDriverLocation, 1000);
        console.log('Location sharing started.');
        document.getElementById('shareLocationBtn').style.backgroundColor = '#4CAF50';
    }
}

function stopSharingLocation() {
    if (isSharingLocation) {
        clearInterval(shareLocationInterval);
        isSharingLocation = false;
        console.log('Location sharing stopped.');
        document.getElementById('shareLocationBtn').style.backgroundColor = '';
    }
}

function toggleLocationSharing() {
    const user = firebase.auth().currentUser;
    if (user) {
        isSharingLocation ? stopSharingLocation() : startSharingLocation();
    } else {
        console.error("User is not authenticated. Can't toggle location sharing.");
    }
}

function updateLastLocationTime() {
    if (lastLocationUpdateTimestamp) {
        const now = Date.now();
        const secondsSinceLastUpdate = Math.round((now - lastLocationUpdateTimestamp) / 1000);
        document.getElementById('lastUpdateTime').textContent = `${secondsSinceLastUpdate}`;
    }
}

function logoutDriver() {
    const auth = firebase.auth();
    const currentDriverId = auth.currentUser.uid;
    const locationRef = firebase.database().ref(`driverLocations/${currentDriverId}`);

    locationRef.remove().then(() => {
        console.log('Driver location removed.');
        auth.signOut().then(() => {
            console.log('Driver logged out.');
            window.location.href = 'index.html';
        }).catch(error => {
            console.error('Error logging out:', error);
        });
    }).catch(error => {
        console.error('Error removing driver location:', error);
    });
}

// Event listeners for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure the auth state is monitored before enabling functionality
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const shareLocationBtn = document.getElementById('shareLocationBtn');
            shareLocationBtn.addEventListener('click', toggleLocationSharing);
            const logoutButton = document.getElementById('logoutButton');
            logoutButton.addEventListener('click', logoutDriver);
            setInterval(updateLastLocationTime, 1000);
        } else {
            console.log("No user is logged in. Please log in.");
        }
    });
});

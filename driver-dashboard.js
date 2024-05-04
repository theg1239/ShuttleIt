// Helper function to get the driver token from local storage
function getDriverToken() {
    return localStorage.getItem('driverToken');  // Retrieve the 'driverToken' from local storage
}

// Global variables for tracking state
let isSharingLocation = false;
let shareLocationInterval;
let lastLocationUpdateTimestamp = null;

// Function to update the last location update time display
function updateLastLocationTime() {
    const lastUpdateTimeElement = document.getElementById('lastUpdateTime');
    if (lastLocationUpdateTimestamp) {
        const secondsAgo = Math.round((Date.now() - lastLocationUpdateTimestamp) / 1000);
        lastUpdateTimeElement.textContent = `${secondsAgo}s`;
    } else {
        lastUpdateTimeElement.textContent = 'Never';
    }
}

// Function to fetch and display driver information
function fetchDriverInfo() {
    const token = getDriverToken();
    if (!token) {
        console.log("No token found. Please log in.");
        window.location.href = 'index.html';
        return;
    }

    fetch('/get-driver-info', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.driverId) {
                const driverIdDisplay = document.getElementById('driverId');
                driverIdDisplay.textContent = data.driverId; // Display driverId
                localStorage.setItem('driverId', data.driverId); // Store it locally if needed elsewhere
            } else {
                console.error('Failed to fetch driver info:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching driver info:', error);
        });
}

// Function to handle location updates
function updateDriverLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const locationUpdate = {
                driverId: localStorage.getItem('driverId'),
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
            };
            try {
                const token = getDriverToken();
                const response = await fetch('/update-location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(locationUpdate)
                });
                const data = await response.json();
                if (data.success) {
                    console.log('Location updated successfully:', data.message);
                    lastLocationUpdateTimestamp = Date.now();
                    updateLastLocationTime();
                } else {
                    console.error('Failed to update location:', data.message);
                }
            } catch (error) {
                console.error('Error sending location update:', error);
            }
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}



// Function to toggle location sharing
function toggleLocationSharing() {
    if (isSharingLocation) {
        clearInterval(shareLocationInterval);
        isSharingLocation = false;
        console.log("Location sharing stopped.");
        document.getElementById('shareLocationBtn').classList.remove('active');  // Change button color to indicate inactive state
    } else {
        isSharingLocation = true;
        updateDriverLocation();  // Immediately update location before starting interval
        shareLocationInterval = setInterval(updateDriverLocation, 5000);  // Continue updating every 5 seconds
        console.log("Location sharing started.");
        document.getElementById('shareLocationBtn').classList.add('active');  // Change button color to indicate active state
    }
}

// Function to handle driver logout
function logoutDriver() {
    fetch('/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getDriverToken()}` }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem('driverToken');  // Clear driver token from local storage
                window.location.href = 'index.html';  // Redirect to login page
            } else {
                console.error('Logout failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display driver information on page load
    fetchDriverInfo();

    // Setup event listeners
    const shareLocationBtn = document.getElementById('shareLocationBtn');
    const logoutButton = document.getElementById('logoutButton');

    if (shareLocationBtn) {
        shareLocationBtn.addEventListener('click', toggleLocationSharing);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutDriver);
    }

    // Update the last location update time every second
    setInterval(updateLastLocationTime, 1000);
});

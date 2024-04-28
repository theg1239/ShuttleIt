// eta.js

// Global variables to store the previous location and timestamp
let prevLocation = null;
let prevTimestamp = null;

// Function to request the student's location and calculate ETA
function requestAndCalculateETA() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const studentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            // Now that we have the student's location, set up the Firebase listener for location updates
            const locationRef = firebase.database().ref('driverLocation');
            locationRef.on('value', (snapshot) => {
                const shuttleLocation = snapshot.val();
                if (shuttleLocation && shuttleLocation.latitude && shuttleLocation.longitude && shuttleLocation.timestamp) {
                    calculateETA(shuttleLocation, studentLocation, shuttleLocation.timestamp);
                }
            });

        }, (error) => {
            console.error("Error getting student's location:", error);
            document.getElementById('eta-time').textContent = 'Location permission denied.';
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        document.getElementById('eta-time').textContent = 'Geolocation not supported.';
    }
}

function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = toRad(coords2.latitude - coords1.latitude);
    var dLon = toRad(coords2.longitude - coords1.longitude);
    var lat1 = toRad(coords1.latitude);
    var lat2 = toRad(coords2.latitude);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in km
    return d;
}
// Function to calculate the ETA based on shuttle and student locations
function calculateETA(shuttleLocation, studentLocation, currentTimestamp) {
    if (prevLocation && prevTimestamp && studentLocation) {
        // Calculate the distance traveled by the shuttle between the two points
        const distanceTraveled = haversineDistance(prevLocation, shuttleLocation);
        const timeElapsed = (currentTimestamp - prevTimestamp) / (1000 * 60 * 60); // Time in hours

        // Calculate shuttle's speed
        const speed = distanceTraveled / timeElapsed;

        // Calculate the remaining distance to the student's location
        const remainingDistance = haversineDistance(shuttleLocation, studentLocation);

        // Calculate the ETA based on the current speed
        const etaHours = remainingDistance / speed;
        const etaMinutes = Math.round(etaHours * 60) + 1; // Convert to minutes and add an extra minute for stops

        // Update the ETA display
        document.getElementById('eta-time').textContent = `${etaMinutes} minutes`;
    }

    // Update the previous shuttle location and timestamp
    prevLocation = shuttleLocation;
    prevTimestamp = currentTimestamp;
}

// Call this function somewhere in your code where you want to trigger the ETA calculation
requestAndCalculateETA();

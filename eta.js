let studentLocation = null;
const updateInterval = 30000; // Interval in milliseconds to update the ETA (e.g., every 30 seconds)

function promptForStudentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            studentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            // Start the periodic update once location is obtained
            fetchShuttleLocationsAndCalculateETA();
            setInterval(fetchShuttleLocationsAndCalculateETA, updateInterval);
        }, error => {
            console.error("Error obtaining student location: ", error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function fetchShuttleLocationsAndCalculateETA() {
    fetch('/api/active-shuttles')
        .then(response => response.json())
        .then(shuttles => {
            const closestShuttle = findClosestShuttle(shuttles);
            if (closestShuttle) {
                const distance = haversineDistance(studentLocation, closestShuttle);
                const eta = calculateETA(distance);
                updateETAUI(eta);
            } else {
                updateETAUI("No shuttles available");
            }
        })
        .catch(error => {
            console.error("Error fetching shuttles:", error);
            updateETAUI("Failed to fetch shuttles");
        });
}

function findClosestShuttle(shuttles) {
    return shuttles.reduce((closest, shuttle) => {
        const shuttleDistance = haversineDistance(studentLocation, shuttle);
        return !closest || shuttleDistance < closest.distance ? { shuttle, distance: shuttleDistance } : closest;
    }, null)?.shuttle;
}

function calculateETA(distance) {
    const speedInKmPerHour = 30;  // Average speed
    const timeInHours = distance / speedInKmPerHour;
    const timeInMinutes = timeInHours * 60 + 1;  // Adding one minute to all calculations
    return `${timeInMinutes.toFixed(2)} minutes`;
}

function updateETAUI(eta) {
    const etaContainer = document.getElementById('eta-time');
    etaContainer.textContent = `ETA: ${eta}`;
}

function haversineDistance(coords1, coords2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

document.addEventListener('DOMContentLoaded', promptForStudentLocation);

let studentLocation = null;
let driverLocations = {};

function promptForStudentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            studentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            fetchDriverLocationsAndCalculateETAs();
        }, error => {
            console.error("Error obtaining student location: ", error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function fetchDriverLocationsAndCalculateETAs() {
    const locationRef = firebase.database().ref('driverLocations');
    locationRef.on('value', snapshot => {
        driverLocations = snapshot.val() || {};
        calculateAndUpdateETAs();
    });
}

function calculateAndUpdateETAs() {
    const currentTime = Date.now();
    const etas = Object.entries(driverLocations).reduce((acc, [driverId, driverLocation]) => {
        if (driverLocation && driverLocation.timestamp && (currentTime - driverLocation.timestamp) <= 300000) { 
            const distance = haversineDistance(studentLocation, driverLocation);
            const eta = distance / calculateSpeed(driverLocation); 
            acc[driverId] = isFinite(eta) ? eta.toFixed(2) : "Not available";
        } else {
            acc[driverId] = "Not available";
        }
        return acc;
    }, {});

    updateETAUI(etas);
}

function updateETAUI(etas) {
    const etaContainer = document.getElementById('eta-container');
    const sortedEtas = Object.entries(etas).sort((a, b) => a[1] - b[1]);

    etaContainer.innerHTML = sortedEtas.map(([driverId, eta]) =>
        `Driver ${driverId}: ETA ${eta} minutes`
    ).join('<br>');

    const activeDriversCount = sortedEtas.filter(([, eta]) => eta !== "Not available").length;
    document.getElementById('shuttles-active').textContent = `Shuttles active: ${activeDriversCount}`;
}

function calculateSpeed(driverId, driverLocations) {

    const driverUpdates = driverLocations[driverId];
    if (driverUpdates && driverUpdates.length >= 2) {

        driverUpdates.sort((a, b) => b.timestamp - a.timestamp);

        const latestUpdate = driverUpdates[0];
        const previousUpdate = driverUpdates[1];

        const FIVE_MINUTES = 5 * 60 * 1000;
        const now = Date.now();
        if (now - latestUpdate.timestamp > FIVE_MINUTES) {

            return { speed: 0, isActive: false };
        }

        const distance = haversineDistance(latestUpdate.location, previousUpdate.location);
        const timeDifference = (latestUpdate.timestamp - previousUpdate.timestamp) / (1000 * 60 * 60);

        const speed = distance / timeDifference;
        return { speed: speed, isActive: true };
    } else {

        return { speed: 0, isActive: false };
    }
}

function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var R = 6371; 
    var dLat = toRad(coords2.latitude - coords1.latitude);
    var dLon = toRad(coords2.longitude - coords1.longitude);
    var lat1 = toRad(coords1.latitude);
    var lat2 = toRad(coords2.latitude);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d; 
}

document.addEventListener('DOMContentLoaded', promptForStudentLocation);

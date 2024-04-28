document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([12.9721, 79.1594], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var shuttleMarker = L.marker([12.9721, 79.1594]).addTo(map)
        .bindPopup('Shuttle Location')
        .openPopup();
});

// Toggle Dark Mode
var darkModeCheckbox = document.getElementById('darkModeCheckbox');
var darkModePreference = localStorage.getItem('darkMode') === 'true';
document.body.classList.toggle('dark-mode', darkModePreference);
darkModeCheckbox.checked = darkModePreference;

darkModeCheckbox.addEventListener('change', function(event) {
    document.body.classList.toggle('dark-mode', event.target.checked);
    localStorage.setItem('darkMode', event.target.checked);
});

// Update Shuttle Count
function updateShuttleCount() {
    fetch('/active-shuttles')  // Endpoint to get active shuttles
        .then(response => response.json())
        .then(data => {
            if (data && data.activeShuttles !== undefined) {
                document.getElementById('shuttles-online').textContent = `${data.activeShuttles} active`;
            } else {
                document.getElementById('shuttles-online').textContent = 'No data available';
            }
        })
        .catch(error => {
            console.error('Error fetching active shuttles:', error);
            document.getElementById('shuttles-online').textContent = 'Failed to fetch data';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    updateShuttleCount();
});

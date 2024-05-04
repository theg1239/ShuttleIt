import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCe23F3CFtz-lbBFxXdjfv-z5oE9PhlyzE",
    authDomain: "shuttle-web-538fa.firebaseapp.com",
    projectId: "shuttle-web-538fa",
    storageBucket: "shuttle-web-538fa.appspot.com",
    messagingSenderId: "189496484474",
    appId: "1:189496484474:web:d8929149d890cf573ad1c3",
    measurementId: "G-M20NXLPBD3"
};

// Initialize Firebase App for Google Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Authentication for students
var provider = new GoogleAuthProvider();
provider.setCustomParameters({
    'hd': 'vitstudent.ac.in'  // Only allow users from the VIT domain
});

document.getElementById('googleLogin').addEventListener('click', () => {
    signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
        window.location.href = 'home.html';  // Redirect on successful login
    }).catch((error) => {
        console.error(error.code, error.message);
    });
});

// Driver login using custom server authentication
document.getElementById('driverLoginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('driverUsername').value;
    const password = document.getElementById('driverPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('driverToken', data.token);
                localStorage.setItem('driverId', data.driverId);
                window.location.href = 'driver-dashboard.html';  // Redirect to the driver dashboard
            } else {
                alert('Invalid credentials');
            }
        })
        .catch(error => {
            console.error('Login request failed:', error);
        });
});

// Dark mode toggle
var checkbox = document.getElementById('darkModeCheckbox');
if (checkbox) {
    checkbox.addEventListener('change', function(event) {
        document.body.classList.toggle('dark-mode', checkbox.checked);
        localStorage.setItem('darkMode', checkbox.checked);
    });
    var darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    checkbox.checked = darkMode;
}

ocument.addEventListener('DOMContentLoaded', function() {
    // Firebase project configuration.
    const firebaseConfig = {
        apiKey: "AIzaSyCe23F3CFtz-lbBFxXdjfv-z5oE9PhlyzE",
        authDomain: "shuttle-web-538fa.firebaseapp.com",
        projectId: "shuttle-web-538fa",
        storageBucket: "shuttle-web-538fa.appspot.com",
        messagingSenderId: "189496484474",
        appId: "1:189496484474:web:d8929149d890cf573ad1c3",
        measurementId: "G-M20NXLPBD3"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Google Login
    document.getElementById('googleLogin').addEventListener('click', function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            'hd': 'vitstudent.ac.in' // Only allow emails from the vitstudent.ac.in domain
        });

        auth.signInWithPopup(provider).then(function(result) {
            // Google Access Token and the signed-in user info.
            // Redirect to student dashboard
            window.location.href = 'student-dashboard.html';
        }).catch(function(error) {
            console.error(error.message);
        });
    });

    // Driver Login with Placeholder Credentials
    document.getElementById('driverLoginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var username = document.getElementById('test').value;
        var password = document.getElementById('test123').value;

        // Placeholder check for the username and password
        if(username === "test" && password === "test123") {
            // Redirect the driver to the driver dashboard or show success message
            window.location.href = 'driver-dashboard.html';
        } else {
            // Show error message for incorrect credentials
            alert('Incorrect username or password.');
        }
    });
});
<script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-firestore.js"></script>

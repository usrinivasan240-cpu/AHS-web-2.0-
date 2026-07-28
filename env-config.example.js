// ========================================
// AHS Environment Configuration
// ========================================
// Copy this file to env-config.js and fill in your actual values.
// env-config.js is gitignored and will NOT be committed.

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Cloud Messaging
const messaging = firebase.messaging();

// Export for use in script.js
window.ahsDB = db;
window.ahsMessaging = messaging;

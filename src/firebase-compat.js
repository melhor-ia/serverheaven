// Firebase Compat Configuration
// Implementa /purpleStone/Configuracao Firebase.md

// Firebase configuration object for compat SDK
window.firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase app
  firebase.initializeApp(window.firebaseConfig);
  
  // Initialize Analytics
  firebase.analytics();
  
  console.log('Firebase initialized with config from environment variables');
}); 
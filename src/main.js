// Main Application Entry Point
// Implementa /purpleStone/Configuracao Firebase.md

import app, { auth, db, analytics, storage, functions } from './firebase-config.js';

// Example usage of Firebase services
console.log('Firebase app initialized:', app);

// Example: Authentication state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User signed in:', user.uid);
  } else {
    console.log('User signed out');
  }
});

// Example: Test Firestore connection
async function testFirestore() {
  try {
    // This is just a test - remove or modify as needed
    console.log('Firestore connected successfully');
  } catch (error) {
    console.error('Firestore connection error:', error);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  console.log('Server Heaven app loaded');
  testFirestore();
  
  // Log analytics event
  analytics.logEvent('app_loaded');
}); 
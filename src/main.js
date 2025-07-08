// Main Application Entry Point
import { functions } from './firebase-config.js';
import { httpsCallable } from 'firebase/functions';

// Get a reference to the 'getGreeting' function
const getGreeting = httpsCallable(functions, 'getGreeting');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Server Heaven app loaded');

  const callFunctionBtn = document.getElementById('callFunctionBtn');
  const messageContainer = document.getElementById('messageContainer');

  callFunctionBtn.addEventListener('click', async () => {
    messageContainer.textContent = 'Calling function...';
    try {
      const result = await getGreeting();
      const data = result.data;
      messageContainer.textContent = `Message from backend: ${data.message}`;
    } catch (error) {
      console.error('Error calling function:', error);
      messageContainer.textContent = 'Error calling function. Check the console.';
    }
  });
}); 
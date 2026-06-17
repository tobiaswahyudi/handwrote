const firebaseConfig = {
    apiKey: "AIzaSyD5h9z3JTufgL7k0nX2VOXTKnVRg0GdrwY",
    authDomain: "handwrote-c92f0.firebaseapp.com",
    projectId: "handwrote-c92f0",
    storageBucket: "handwrote-c92f0.firebasestorage.app",
    messagingSenderId: "27898436054",
    appId: "1:27898436054:web:566e0ccd8c7a057a4f6c77",
    measurementId: "G-9F3BKR7Z9S"
};
  
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSXm-luptfwcO6okbOBINyQZlXW7uWQ8o",
  authDomain: "chatbot-resume-bd8c0.firebaseapp.com",
  projectId: "chatbot-resume-bd8c0",
  storageBucket: "chatbot-resume-bd8c0.firebasestorage.app",
  messagingSenderId: "316823785715",
  appId: "1:316823785715:web:0a9e679bd3f47885576786",
  measurementId: "G-5XWMWNV6CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnW18PrSAqo4RgK7BS8qp3E3Fl0520VSA",
  authDomain: "spic-19d60.firebaseapp.com",
  projectId: "spic-19d60",
  storageBucket: "spic-19d60.firebasestorage.app",
  messagingSenderId: "249118420619",
  appId: "1:249118420619:web:3a0e322991fb221dceae8e",
  measurementId: "G-8PBBTTLZG0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

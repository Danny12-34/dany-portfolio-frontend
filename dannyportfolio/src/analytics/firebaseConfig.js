// src/analytics/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore database

const firebaseConfig = {
  apiKey: "AIzaSyAj-X4YiddgXKhk3P46kuu2OZvkxir6qic",
  authDomain: "danny-portfolio-f64bb.firebaseapp.com",
  projectId: "danny-portfolio-f64bb",
  storageBucket: "danny-portfolio-f64bb.firebasestorage.app",
  messagingSenderId: "878515449446",
  appId: "1:878515449446:web:42136f1f5e4449508c07a7",
  measurementId: "G-YLW45ZMZL0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);
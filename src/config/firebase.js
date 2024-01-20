// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTXH3OW1EUbee8yXt04YkC7zvTWfCt1Ts",
  authDomain: "myblog-aee44.firebaseapp.com",
  projectId: "myblog-aee44",
  storageBucket: "myblog-aee44.appspot.com",
  messagingSenderId: "851291435958",
  appId: "1:851291435958:web:b7767c42b275579bf74717",
  measurementId: "G-D7D8PWJ936",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get instances of Auth, Firestore, and Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

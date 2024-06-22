// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-state-3896b.firebaseapp.com",
  projectId: "mern-state-3896b",
  storageBucket: "mern-state-3896b.appspot.com",
  messagingSenderId: "1026154974254",
  appId: "1:1026154974254:web:75d38449f23a3bc9a363bf",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

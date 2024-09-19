// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b0af8.firebaseapp.com",
  projectId: "mern-blog-b0af8",
  storageBucket: "mern-blog-b0af8.appspot.com",
  messagingSenderId: "151380018759",
  appId: "1:151380018759:web:bb879cae3dd6669eb59362"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore"; // import firestore service

const firebaseConfig = {
  apiKey: "AIzaSyBJ9rcVBIAM0hXXkDKveeH5GDvWySgGZN4",
  authDomain: "react-notes-adccb.firebaseapp.com",
  projectId: "react-notes-adccb",
  storageBucket: "react-notes-adccb.appspot.com",
  messagingSenderId: "138457094629",
  appId: "1:138457094629:web:fb746617a7e5225e58f70c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // returns an instance of the database
export const notesCollection = collection(db, 'notes');
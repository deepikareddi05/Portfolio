import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore"; // Perbarui ini


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApKvLDLA24DpKtDfColeFVhgSeyoOG7ng",
  authDomain: "my-portfolio-506f2.firebaseapp.com",
  projectId: "my-portfolio-506f2",
  storageBucket: "my-portfolio-506f2.firebasestorage.app",
  messagingSenderId: "612722736720",
  appId: "1:612722736720:web:90779e5c1d9fa50d8e5b55",
  measurementId: "G-7Z3BVHXMZD"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
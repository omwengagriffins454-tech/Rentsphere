import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDM-Mwspu6Rxqg-WN8w8g15JSSYJ2d-nhU",
  authDomain: "rentsphere-79dfb.firebaseapp.com",
  projectId: "rentsphere-79dfb",
  storageBucket: "rentsphere-79dfb.firebasestorage.app",
  messagingSenderId: "491691508093",
  appId: "1:491691508093:web:844420545ce52dea2b0c14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

export { auth, db };
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS1zEdLcuPKhwVzEUaOf2tm_eg_WCdFl4",
  authDomain: "portflio-1bdac.firebaseapp.com",
  projectId: "portflio-1bdac",
  storageBucket: "portflio-1bdac.firebasestorage.app",
  messagingSenderId: "401659603041",
  appId: "1:401659603041:web:308b3f3718be5a8157e220"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;

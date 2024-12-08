// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgCPwravCD0z1yA2-zBn8BhD5tGLQ2Egc",
  authDomain: "iot-zebra-a7889.firebaseapp.com",
  projectId: "iot-zebra-a7889",
  databaseURL: "https://iot-zebra-a7889-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "iot-zebra-a7889.firebasestorage.app",
  messagingSenderId: "560924732058",
  appId: "1:560924732058:web:e7b38a6e1385f90eb24d23",
  measurementId: "G-3TWFHF2H8K"
};

// Initialize Firebase
const cong = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(cong);
const database = getDatabase(cong);
const functions = getFunctions(cong);

const app = {
    storage,
    database,
    functions,
};
  
export default app;

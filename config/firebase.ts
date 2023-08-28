import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native'


const firebaseConfig = {
    apiKey: "AIzaSyBtOiiXKSRlSEz5WSF5zFnow5p7Uzvg460",
    authDomain: "fsbiso.firebaseapp.com",
    databaseURL: "https://fsbiso-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fsbiso",
    storageBucket: "fsbiso.appspot.com",
    messagingSenderId: "633338868564",
    appId: "1:633338868564:web:38a64613f8d76771248ec1",
    measurementId: "G-JF5PEDM8FW"
  };


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export { db, storage, auth };
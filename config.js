// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4_ZIpU5tT5RlwVA35Ttokk7hgjnBSzdE",
    authDomain: "react-native-project-b83ef.firebaseapp.com",
    projectId: "react-native-project-b83ef",
    storageBucket: "react-native-project-b83ef.firebasestorage.app",
    messagingSenderId: "1046257602159",
    appId: "1:1046257602159:web:c306e3e4ed4ed3fe63479a",
    measurementId: "G-NTB23YX02T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

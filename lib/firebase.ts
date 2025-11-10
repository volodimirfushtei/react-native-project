// src/lib/firebase.ts
import {FirebaseApp, getApp, getApps, initializeApp} from 'firebase/app';
import {Auth, getAuth} from 'firebase/auth';
import {Firestore, getFirestore} from 'firebase/firestore';
import {FirebaseStorage, getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID

    // ...
};


let app: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;
let storageInstance: FirebaseStorage;

export const getFirebaseApp = () => {
    if (!app) {
        console.log('Initializing Firebase App...');
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }
    return app;
};

export const getAuthInstance = () => {
    if (!authInstance) {
        const app = getFirebaseApp();
        authInstance = getAuth(app);
        console.log('Auth instance created');
    }
    return authInstance;
};

export const getDbInstance = () => {
    if (!dbInstance) {
        const app = getFirebaseApp();
        dbInstance = getFirestore(app);
    }
    return dbInstance;
};

export const getStorageInstance = () => {
    if (!storageInstance) {
        const app = getFirebaseApp();
        storageInstance = getStorage(app);
    }
    return storageInstance;
};
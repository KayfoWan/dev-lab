import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signOut, 
    onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7mFEhCmdG-a1P-89xIEdIcR3Gq7SU_Bo",
    authDomain: "practice-3f9a0.firebaseapp.com",
    projectId: "practice-3f9a0",
    storageBucket: "practice-3f9a0.appspot.com",
    messagingSenderId: "590706174872",
    appId: "1:590706174872:web:1b8ed3f0cd84c446e859ed"
};

//firebase init
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();

//collection Ref
const colRef = collection(db, 'books');


import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, onSnapshot,
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

//get collection data
getDocs(colRef).then(snapshot=>{
    //console.log(snapshot.data); returns undefined(not a real function)
    //console.log(snapshot.docs); returns whole query
    let books = [];
    snapshot.docs.forEach(doc => {
        books.push({...doc.data(), id: doc.id})
    });
    console.log(books);
}).catch(err=>{
    console.log(err.message);
});

//addding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
  })
  .then(() => {
    addBookForm.reset()
  })
})

//deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})
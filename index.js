import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, getDocs, onSnapshot,
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

/* NORMAL COLLECTION DATA

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

*/

/* REAL TIME COLLECTION DATA

//real time collection data
onSnapshot(colRef, (snapshot) => {
  let books = []
  snapshot.docs.forEach(doc => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log(books)
});

*/

// query
//const q = query(colRef, where("Author", '==', "Kai Worley"));
const q2 = query(colRef, where("author", '==', "Kai Worley"), orderBy('createdAt'));
//real time collection data using a query
let books = [];
/*
onSnapshot(q, (snapshot) => {
  snapshot.docs.forEach(doc => {
    books.push({...doc.data(), id: doc.id});
  });
});
*/
onSnapshot(q2, (snapshot) => {
  snapshot.docs.forEach(doc => {
    books.push({...doc.data(), id: doc.id});
  });
  console.log(books);
});
//console.log(books);

//addding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
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

// fetching a single document (& realtime)
const docRef = doc(db, 'books', '32K9vFrxkRVS6TTCPCGa');

/*
getDoc(docRef)
  .then(doc => {
    console.log(doc.data(), doc.id)
});
*/

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
});

// updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title'
  })
  .then(() => {
    updateForm.reset()
  })
})
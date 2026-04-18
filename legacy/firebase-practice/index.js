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
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
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
});

//signing up users
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      //console.log(err.message)
    })
});

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})
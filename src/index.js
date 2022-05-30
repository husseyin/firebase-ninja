// firebase bağlantısı için gerekli config bilgisi
// kullanabilir hale gelmesi için firebase import edilmeli
// npm install firebase
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCShsiQ_D6TWxldrJEcqtuaI4-R8aZd6hE",
  authDomain: "fir-ninja-d8c3b.firebaseapp.com",
  projectId: "fir-ninja-d8c3b",
  storageBucket: "fir-ninja-d8c3b.appspot.com",
  messagingSenderId: "464465498011",
  appId: "1:464465498011:web:1dce36513a44cc6ea61b3e"
};

// init firebase app
initializeApp(firebaseConfig);

// init service
const db = getFirestore();
const auth = getAuth();

// collections ref
const colRef = collection(db, "books");

// queries
// query oluştururken referans verdik
// where ile filtreme ve koşul verdik
// orderBy ile title kolonuna göre sıralama yaptık ancak,
// sıralama yapabilmesi için console.firebase tarafında indexleme yapılmalı
// const q = query(
//   colRef,
//   where("author", "==", "patrick rothfuss"),
//   orderBy("title", "desc")
// );

// createdAt ile datalara zaman belgesi ekledik ve orderby ile zamana göre sıraladık
const q = query(colRef, orderBy("createdAt"));
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// real time collection data
// ekleme veya silme değişikliğinde anlık olarak yeniden çağrılır
// onSnapshot(colRef, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });

// adding documents
// querySelector ile istenilen formu çektik
// addEventListener ve preventDefault komutları submit durumu engellendi
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // firebase yeni kayıt ekledik
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    // zaman bilgisi ekledik
    createdAt: serverTimestamp(),
  }).then(() => {
    // işlem sonunda formu temizledik
    addBookForm.reset();
  });
});

// deleting documents
// class ile form bilgilerini aldık ve submit olma durumundan yakaldık
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // datanın referans değerini id bilgisi ile çektik
  const docRef = doc(db, "books", deleteBookForm.id.value);
  // referans değerine göre silme işlemini tamamladık
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// get a single document
// firebase'ten tek data çekmek için kullandık
// onSnapshot datada yapılan anlık değişikliği uyguladı
const docRef = doc(db, "books", "xSl3jgeACcJHyBJFIkWa");
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);
  updateDoc(docRef, {
    title: "title updated",
  }).then(() => {
    updateForm.reset();
  });
});

// signin users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // girilen email ve pass değerlerini aldık
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  // kaydedilen kullanıcıya eriştik ve gösterdik
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //console.log("created user:", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      // oluşacak hataları ve parola uzunluğu vs. gibi uyarıları gösterdik
      console.log(err.message);
    });
});

// logging in and out
const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //console.log("user logged in:", cred.user);
      //loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      //console.log("the user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// subscribing to auth changes
// kullanıcının giriş yaptığını, çıkış yaptığını veya yeni kaydolduğunu yakalar
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

// unsubscribing from changes (auth & db)
// kolonları, verileri ve giriş bilgisini const ile sabite bağlarak burada çağırdık
// unusbscribe olduğumuz için izleme artık olmayacaktır
// yani onAuthStateChanged değişiklikleri görünmeyecek
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});

import { initializeApp } from "firebase/app";
import { createContext , useContext} from "react";
import {getAuth, createUserWithEmailAndPassword , GoogleAuthProvider , signInWithPopup , signInWithEmailAndPassword , signOut } from "firebase/auth";
import {getFirestore, collection , addDoc , getDocs , query , where , doc, getDoc, } from "firebase/firestore"


const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyD7kXDmxAiJK2eiDbNM-y8IFPOTpzubm-o",
    authDomain: "bookhive-50340.firebaseapp.com",
    projectId: "bookhive-50340",
    storageBucket: "bookhive-50340.firebasestorage.app",
    messagingSenderId: "895872133049",
    appId: "1:895872133049:web:bf7c3d9feb0e9f98127868",
    measurementId: "G-GF9EKGTK8T"
  };

  

export const useFirebase = () => useContext(FirebaseContext);

const FirebaseApp = initializeApp(firebaseConfig);
const FirebaseAuth = getAuth(FirebaseApp);
const FirebaseStore = getFirestore(FirebaseApp);
const Provider = new GoogleAuthProvider();
const getCurrentUser = () => FirebaseAuth.currentUser;




export const FirebaseProvider = (props) => {

    // firebase authentication
    const SignUpwithEandP = (email , password) => 
        createUserWithEmailAndPassword(FirebaseAuth , email , password);

    const SignInwithEandP = (email , password) => 
        signInWithEmailAndPassword(FirebaseAuth , email , password);

    const SignUpwithGoogle = () => 
        signInWithPopup(FirebaseAuth , Provider);

    const logout = async () => {
        try {
            await signOut(FirebaseAuth);
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

       
    // books listing handle here
    const handleNewListing = async (name, isbnum, price, description, uniqueKeys ) => {
        const user = getCurrentUser();
        if (!user) {
            console.error("User not logged in");
            return;
        }
        
        console.log("Preparing to add document:", { name, isbnum, price, description , uniqueKeys, uid: user.uid });
     
    
        try {
            const docRef = await addDoc(collection(FirebaseStore, "books"), {
                name,
                isbnum,
                price,
                description,
                images: uniqueKeys,
                uid: user.uid,
            });
           
            
            console.log("Document added with ID:", docRef.id);
           
        } catch (error) {
            console.error("Error adding document to Firestore:", error.message);
        }
    };
    


const getBooks = async () => {
    const user = getCurrentUser(); 
    if (!user) {
        console.error("User not logged in");
        return [];
    }
    
    const q = query(collection(FirebaseStore, "books"), where("uid", "==", user.uid));

    try {
        const querySnapshot = await getDocs(q);
        const books = [];
        querySnapshot.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() }); 
        });
       
        return books;
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return [];
    }
};

const fetchBook = async (id) => {
   const docRef = doc(FirebaseStore , 'books' , id) ;
   const result = await getDoc(docRef);
   console.log(result);
   return result;
}

const fetchOrders = async (bookId, uniqueKeys = [], qty) => {
    const user = getCurrentUser();
  
    if (!qty || qty <= 0) {
      console.error("Invalid quantity provided for order");
      return;
    }

    const bookRef = doc(FirebaseStore, "books", bookId);
    const bookDoc = await getDoc(bookRef);

    const bookData = bookDoc.data();
  
    const collectionRef = collection(FirebaseStore, "books", bookId, "orders");
    try {
      const refrence = await addDoc(collectionRef, {
        userId: user.uid,
        username:user.displayName,
        bookName: bookData.name,
        price: bookData.price,
        email: user.email,
        images: uniqueKeys,
        Quantity: qty,
      });
     
      return refrence;
    } catch (error) {
      console.error("Error adding order to Firestore:", error.message);
      throw error;
    }
  };

  const getOrders = async () => {
    const user = getCurrentUser(); 

    const booksRef = collection(FirebaseStore, "books");

    try {
        const booksSnapshot = await getDocs(booksRef);
        const orders = [];

        for (const bookDoc of booksSnapshot.docs) {
            const ordersRef = collection(bookDoc.ref, "orders");
            const ordersQuery = query(ordersRef, where("userId", "==", user.uid));
            const ordersSnapshot = await getDocs(ordersQuery);

            ordersSnapshot.forEach((doc) => {
                orders.push({ id: doc.id, ...doc.data() });
            });
        }

        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return [];
    }
};



    return <FirebaseContext.Provider value={{SignUpwithEandP ,SignInwithEandP ,SignUpwithGoogle , handleNewListing , getBooks , logout , fetchBook , fetchOrders , getOrders}}>
        {props.children}</FirebaseContext.Provider>
};



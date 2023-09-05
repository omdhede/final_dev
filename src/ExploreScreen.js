import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import FileUpload from "./FileUpload";
// import { Link } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyDVyUhbLUu0JZ2S5dRVWZb4_uT7dVblm9I",
  authDomain: "login-register-app-be826.firebaseapp.com",
  databaseURL: "https://login-register-app-be826-default-rtdb.firebaseio.com",
  projectId: "login-register-app-be826",
  storageBucket: "login-register-app-be826.appspot.com",
  messagingSenderId: "97352693655",
  appId: "1:97352693655:web:1a415045b8cf1c5fd4b6d2",
};

firebase.initializeApp(firebaseConfig);

const ExploreScreen = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Check if the user is already signed in
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  const signOut = () => {
    firebase.auth().signOut();
  };
  return (
    <div>
      <p>Welcome, {user.displayName}!</p>
      <FileUpload user={user} />
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default ExploreScreen;

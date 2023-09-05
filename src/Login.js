import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigate, Link } from "react-router-dom";
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

const Login = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

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

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setError(error.message);
    }
    navigate("/login");
  };

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    navigate("/login");
  };

  const navigate = useNavigate();

  const handleSharing = () => {
    navigate("/upload");
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button>Let's Go Into 3D World</button>
          <button onClick={handleSharing}>Share Your Creation</button>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h2 style={{ fontWeight: "500", fontSize: "25px" }}>
            You are not logged in.
          </h2>
          <h4 style={{ fontWeight: "400", fontSize: "20px" }}>Login</h4>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>Login</button>
          <br />
          Don't have an account? <Link to={'/register'} style={{textDecoration: "none", color: "blue"}}>Signup</Link>
          <p>Or</p>
          <button onClick={signIn}>Sign In with Google</button>
        </div>
      )}
    </div>
  );
};

export default Login;

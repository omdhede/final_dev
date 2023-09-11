import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigate, Link } from "react-router-dom";
import "./cssFiles/Login.css";

import loginVid from "./assets/LoginPageAssets/tree.mp4";

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
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State for login button
  const [isSigningIn, setIsSigningIn] = useState(false);

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
      setIsLoggingIn(true); // Disable the login button
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoggingIn(false); // Re-enable the login button
    }
    navigate("/login");
  };

  const signIn = () => {
    setIsSigningIn(true); // Disable the sign in with Google button
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    navigate("/login");
  };

  const navigate = useNavigate();

  const handleSharing = () => {
    navigate("/upload");
  };

  const handleExplore = () => {
    navigate("/explore");
  };

  const signOut = () => {
    firebase.auth().signOut();
    setIsSigningIn(false);
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleExplore}>Let's Go Into 3D World</button>
          <button onClick={handleSharing}>Share Your Creation</button>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div className="login_wrapper">
          <video src={loginVid} autoPlay loop muted />

          <div className="login_container">
            <h2 id="login_heading">Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div id="login_form">
              <div>
                <h4 class="login_top_headings">Email</h4>
                <input
                  className="login_input_fields"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <h4 class="login_top_headings">Password</h4>
                <input
                  className="login_input_fields"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                id="login_btn"
                onClick={handleLogin}
                disabled={isLoggingIn || isSigningIn}
              >
                {isLoggingIn ? "Logging In..." : "Login"}
              </button>
            </div>

            <h4>
              <Link to={"/forgetPassword"}>Forget Password</Link>
            </h4>

            <h4 id="signup_direct_text">
              Don't have an account?{" "}
              <Link
                to={"/register"}
                style={{ textDecoration: "none", color: "#F2B500" }}
              >
                Signup
              </Link>
            </h4>

            <div id="line_above_google_auth_login"></div>

            <button
              id="login_with_google_btn"
              onClick={signIn}
              disabled={isLoggingIn || isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Sign In with Google"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

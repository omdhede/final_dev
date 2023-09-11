import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { useNavigate, Link } from "react-router-dom";
import "./cssFiles/Register.css";

import signUpVid from "./assets/RegisterPageAssets/Bike.mp4";

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

const Register = () => {
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    const { email, password, confirmPassword } = formData;

    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // You can also update the user's profile with their username
      await userCredential.user.updateProfile({
        displayName: formData.username,
      });

      // Clear the form data
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      alert("Registration successful!");
    } catch (error) {
      setError("Error during registration. Please try again.");
      setButtonDisabled(false);
    }
    navigate("/login");
  };

  const handleGoogleSignUp = async () => {
    setButtonDisabled(true);
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const userCredential = await firebase.auth().signInWithPopup(provider);
      // Check if the user is new and create an account if they are
      if (userCredential.additionalUserInfo.isNewUser) {
        // You can also update the user's profile with their username
        await userCredential.user.updateProfile({
          displayName: formData.username,
        });
        alert("Google sign-up successful!");
      } else {
        alert("Welcome back!");
      }
    } catch (error) {
      console.error(error.message);
      setError("Google sign-up failed. Please try again.");
      setButtonDisabled(false);
    }
    navigate("/login");
  };

  return (
    <div className="register_wrapper">
      <video src={signUpVid} autoPlay loop muted />

      <div className="register_container">
        <h2 id="register_heading">Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form id="reg_form" onSubmit={handleSubmit}>
          <div>
            <h4 class="register_top_headings">Username</h4>
            <input
              className="register_input_fields"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h4 class="register_top_headings">Email</h4>
            <input
              className="register_input_fields"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h4 class="register_top_headings">Password</h4>
            <input
              className="register_input_fields"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h4 class="register_top_headings">Confirm Password</h4>
            <input
              className="register_input_fields"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button id="sign_up_btn" type="submit" disabled={isButtonDisabled}>
            {isButtonDisabled ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <h4 id="login_direct_text">
          have an account?{" "}
          <Link
            to={"/login"}
            style={{ textDecoration: "none", color: "#F2B500" }}
          >
            Login
          </Link>
        </h4>

        <div id="line_above_google_auth_register"></div>

        <button
          id="signup_with_google_btn"
          onClick={handleGoogleSignUp}
          disabled={isButtonDisabled}
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default Register;

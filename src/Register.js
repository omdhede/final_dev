import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { useNavigate, Link } from "react-router-dom";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_IRL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
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
    if (password.length < 8) {
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
      console.error(error.message);
      setError('Error during registration. Please try again.');
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
    navigate('/login');
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
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
          <input
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
          <input
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
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={isButtonDisabled}>
          {isButtonDisabled ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      Do have an account? <Link to={'/login'} style={{textDecoration: "none", color: "blue"}}>Login</Link>

      <p>Or</p>
      <button onClick={handleGoogleSignUp} disabled={isButtonDisabled}>
        Sign Up with Google
      </button>
    </div>
  );
};

export default Register;

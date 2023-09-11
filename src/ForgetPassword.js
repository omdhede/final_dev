// ForgotPassword.js
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState(null);

  const handleResetPassword = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setResetEmailSent(true);
      setError(null);
    } catch (error) {
      setResetEmailSent(false);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {resetEmailSent ? (
        <p>An email with instructions to reset your password has been sent to your email address. <Link style={{textDecoration: "none"}} to={'/login'}>Login...</Link></p>
      ) : (
        <>
          <p>Enter your email address to reset your password:</p>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;

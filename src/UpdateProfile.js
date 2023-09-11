import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import { updateProfile } from "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setNewPhoto(file);
  };
  const uploadNewPhoto = async () => {
    if (newPhoto) {
      const storageRef = firebase.storage().ref(`profile_photos/${user.uid}`);
      const snapshot = await storageRef.put(newPhoto);

      // Get the URL of the uploaded photo
      const photoURL = await snapshot.ref.getDownloadURL();

      // Update the user's profile data with the new photo URL
      await firebase.firestore().collection("users").doc(user.uid).update({
        profilePhotoURL: photoURL,
      });
      alert("Photo Uploaded")
    }
  };

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

  return (
    <div>
      <h2>Profile Page</h2>
      <img
        src={user?.profilePhotoURL || "default-profile-photo.jpg"}
        alt="Profile"
      />

      <input type="file" accept="image/*" onChange={handlePhotoChange} />
      <button onClick={uploadNewPhoto}>Upload New Photo</button>
    </div>
  );
};

export default UpdateProfile;

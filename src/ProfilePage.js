// import React, { useEffect, useState } from "react";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import "firebase/compat/storage";

// const ProfilePage = () => {
//   // const user = firebase.auth().currentUser;
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check if the user is already signed in
//     const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
//       if (authUser) {
//         setUser(authUser);
//       } else {
//         setUser(null);
//       }
//     });

//     // Clean up the listener when the component unmounts
//     return () => unsubscribe();
//   }, []);

//   return (
//     <div>
//       <img src={user?.photoURL} alt="Profile Image"/>
//       <input type="file" accept="image/*"/>
//       <p>{user?.displayName}</p>
//       <button>Edit Profile</button>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  // const [newUsername, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const navigate = useNavigate();

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setNewPhoto(file);
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setNewUsername(username);
  };

  const uploadNewPhoto = async () => {
    if (newPhoto) {
      const storageRef = firebase.storage().ref(`${user?.uid}/profilePhoto`);
      const snapshot = await storageRef.put(newPhoto);

      // Get the URL of the uploaded photo
      const photoURL = await snapshot.ref.getDownloadURL();
      // const username = await user?.displayName;

      // Update the user's photoURL in Firebase Auth
      await user?.updateProfile({
        photoURL,
      });

      // Update the user's profile data in Firestore if you are using Firestore
      // Example: await firebase.firestore().collection('users').doc(user.uid).update({ photoURL });
    }

    navigate("/profile");

    alert("Changed Successfully");
  };

  const updateUsername = async () => {
    try {
      await user?.updateProfile({
        displayName: newUsername, // Use displayName to update the username
      });

      navigate("/profile");

      alert("Username Changed Successfully");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
    <div>
      <img
        src={user?.photoURL}
        alt="Profile Image"
        style={{ maxWidth: "300px", maxHeight: "400px" }}
      />
      <input type="file" accept="image/*" onChange={handlePhotoChange} />
      <button onClick={uploadNewPhoto}>Change Profile Photo</button>
      <br />
      <input
        type="text"
        placeholder={user?.displayName}
        value={newUsername}
        onChange={handleUsernameChange}
      />
      <button onClick={updateUsername}>Update Username</button>
      <p>{user?.displayName}</p>
      <p>{user?.email}</p>
    </div>
  );
};

export default ProfilePage;

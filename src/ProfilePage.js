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

  const navigate = useNavigate()

  const handleChange = () => {
    navigate('/profile/edit%profile')
  }

  return (
    <div>
      <img
        src={user?.photoURL}
        alt="Profile Image"
        style={{ maxWidth: "300px", maxHeight: "400px" }}
      />
      <br />
      <p>{user?.displayName}</p>
      <p>{user?.email}</p>
      <button onClick={handleChange}>Edit Profile</button>
    </div>
  );
};

export default ProfilePage;



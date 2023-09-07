import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { Link } from "react-router-dom";

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

const PostUpload = ({ history }) => {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const user = firebase.auth().currentUser;

  const handleThumbnailChange = (e) => {
    const selectedThumbnail = e.target.files[0];
    setThumbnail(selectedThumbnail);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!user) {
      console.error("User not signed in.");
      return;
    }

    if (!title || !description || !thumbnail || !file) {
      console.error("Please fill out all fields.");
      return;
    }

    // Upload thumbnail
    const thumbnailRef = firebase
      .storage()
      .ref(`${user.uid}/posts/${title}/thumbnail/${thumbnail.name}`);
    const thumbnailUploadTask = thumbnailRef.put(thumbnail);

    thumbnailUploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
      },
      async () => {
        // Thumbnail upload complete
        const thumbnailUrl = await thumbnailRef.getDownloadURL();
        setThumbnailURL(thumbnailUrl);

        // Upload file
        const fileRef = firebase
          .storage()
          .ref(`${user.uid}/posts/${title}/file/${file.name}`);
        const fileUploadTask = fileRef.put(file);

        fileUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error(error);
          },
          async () => {
            // File upload complete

            // Upload description
            const descriptionRef = firebase
              .storage()
              .ref(`${user.uid}/posts/${title}/description/description.txt`);
            const descriptionUploadTask = descriptionRef.putString(description);
            descriptionUploadTask.on(
              "state_changed",
              () => {},
              (error) => {
                console.error(error);
              }
            );
            setUploadComplete(true);
          },

          async () => {
            // File upload complete
            const fileUrl = await fileRef.getDownloadURL();

            // Save post data in Firestore
            const postsCollection = firebase.firestore().collection("posts");
            await postsCollection.add({
              title,
              description,
              thumbnailUrl,
              fileUrl,
              userId: user.uid,
            });

            setUploadProgress(100);
          }
        );
        setUploadStatus(true);
      }
    );
  };

  return (
    <div>
      <h2>Create a Post</h2>

      <br />
      <br />
      <button style={{ padding: "1rem" }}>
        <Link to={"/login"} style={{ textDecoration: "none", color: "black" }}>
          X
        </Link>
      </button>
      <br />
      <br />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <br />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailChange}
        required
      />
      <br />
      <br />
      <input type="file" onChange={handleFileChange} required />
      <br />
      <br />
      <button onClick={handleUpload}>Upload Post</button>
      <br />
      <br />
      <br />
      {uploadStatus && <div>Progress: {uploadProgress.toFixed(1)}%</div>}
      {uploadComplete && (
        <div>
          Upload completed! <br /> <Link to={'/explore'} style={{textDecoration: 'none', color: 'black'}}><h4>Check it out!!!</h4></Link>
        </div>
      )}
      {thumbnailURL && (
        <div>
          <img
            src={thumbnailURL}
            alt="Thumbnail"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

export default PostUpload;

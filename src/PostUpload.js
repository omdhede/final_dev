import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { Link } from "react-router-dom";
import "./cssFiles/PostUpload.css";

import cancelIcon from "./assets/UploadPageAssets/cancel_icon.png";
import thumbnailIMG from "./assets/UploadPageAssets/thumbnail_logo.png";
import model from "./assets/UploadPageAssets/model_logo.png";

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

const PostUpload = () => {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [thumbnailURL, setThumbnailURL] = useState(null);

  const [selectedThumbnailURL, setSelectedThumbnailURL] = useState(null);
  const [selectedModelURL, setSelectedModelURL] = useState(null);

  const user = firebase.auth().currentUser;

  const handleThumbnailChange = (e) => {
    const selectedThumbnail = e.target.files[0];
    setThumbnail(selectedThumbnail);
    setSelectedThumbnailURL(URL.createObjectURL(selectedThumbnail));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setSelectedModelURL(URL.createObjectURL(selectedFile));
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
    <div className="wrapper">
      <div class="nav">
        <div style={{ fontWeight: "400", color: "gray" }}>
          {uploadStatus && (
            <div id="upload_progress_text">
              Upload Progress: {uploadProgress.toFixed(1)}%
            </div>
          )}
        </div>

        {uploadComplete && (
          <div id="upload_completed_text">
            Upload completed! -
            <Link
              to={"/explore"}
              style={{ textDecoration: "none" }}
            >
              <h4 id="redirect_btn">Check it out !</h4>
            </Link>
          </div>
        )}
      </div>
      <div class="content_container">
        <button id="cancel_btn">
          <Link to={"/login"}>
            <img src={cancelIcon} />
          </Link>
        </button>

        <div className="main_container">
          <input
            id="title_text"
            type="text"
            placeholder="A VERY LOOOOOOOOOOOOONG TITLE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="upload_section">
            <div className="thumbnail_side">
              <h3 class="upload_headings">THUMBNAIL</h3>

              <input
                id="thumbnail_upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                required
              />

              {selectedThumbnailURL ? (
                <div>
                  <img
                    src={selectedThumbnailURL}
                    // className="upload_logos"
                    alt="Thumbnail"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      overflow: "hidden",
                      borderRadius: "15px",
                      marginBottom: "20px",
                    }}
                  />
                </div>
              ) : (
                <img
                  className="upload_logos"
                  src={thumbnailIMG}
                  alt="Thumbnail Placeholder"
                />
              )}

              <p class="upload_supply_text">
                Drag and drop an image, or{" "}
                <label for="thumbnail_upload">Browse</label>
              </p>

              <p class="upload_supply_text">
                Minimum 1600px width recommended. Max 1GB each
              </p>

              <p class="upload_supply_text">High resolution 3D (obj, srt)</p>
            </div>

            <div className="model_side">
              <h3 class="upload_headings">3D MODEL</h3>

              <input
                id="model_upload"
                type="file"
                onChange={handleFileChange}
                required
              />

              {selectedModelURL ? (
                <div>
                  <img
                    src={selectedModelURL}
                    alt="Model"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      overflow: "hidden",
                      borderRadius: "15px",
                      marginBottom: "20px",
                    }}
                  />
                </div>
              ) : (
                <img
                  className="upload_logos"
                  src={model}
                  alt="Model Placeholder"
                />
              )}

              <p class="upload_supply_text">
                Drag and drop an image, or{" "}
                <label for="model_upload">Browse</label>
              </p>
              <p class="upload_supply_text">
                Minimum 1600px width recommended. Max 10MB each
              </p>
              <p class="upload_supply_text">
                High resolution images (png, jpg, gif)
              </p>
            </div>
          </div>

          <input
            id="desc_text"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button id="upload_btn" onClick={handleUpload}>
          UPLOAD
        </button>
      </div>

      {/* {thumbnailURL && (
        <div>
          <img
            src={thumbnailURL}
            alt="Thumbnail"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )} */}
    </div>
  );
};

export default PostUpload;

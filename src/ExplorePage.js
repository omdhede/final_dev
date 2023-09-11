import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/storage";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExplorePage = () => {
  const [user, setUser] = useState(null);
  const storage = getStorage();
  const [allUrls, setAllUrls] = useState([]);
  const [parentFolderNames, setParentFolderNames] = useState([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  //   const user = firebase.auth().currentUser;
  //   const uid = user.uid;

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

  useEffect(() => {
    const fetchPost = async () => {
      if (!user?.uid) {
        return;
      }
      try {
        const urls = [];
        const names = [];
        const listRef = ref(storage, `${user.uid}/posts`);
        const postFolders = await listAll(listRef);
        // postFolders.prefixes.map(folderRef)
        const all = await Promise.all(
          postFolders.prefixes.map(async (folderRef) => {
            const thumbnailFolderRef = ref(folderRef, "thumbnail");
            const items = await listAll(thumbnailFolderRef);
            if (items.items.length > 0) {
              const url = await getDownloadURL(items.items[0]);

              // Extract and store the parent folder name
              const folderName = folderRef.name.split("/").pop();
              names.push(folderName);
              return url;
            }
          })
        );
        setAllUrls(all);
        setParentFolderNames(names);
        console.log(names);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [user, storage]);

  
  return (
    <div>
      {allUrls.map((url, index) => {
        const folderName = parentFolderNames[index];
        return (
          <div key={url}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link to={`/main/${folderName}`}>
                <img
                  src={url}
                  alt="Thumbnail"
                  style={{
                    maxWidth: "400px",
                    maxHeight: "300px",
                    padding: "20px",
                  }} // Add onClick handler
                />
                <p>{folderName}</p>
              </Link>
            </div>
          </div>
        );
      })}
      {selectedFileUrl && (
        <div>
          <p>Selected File:</p>
          <a href={selectedFileUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;

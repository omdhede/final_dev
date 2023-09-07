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
        const listRef = ref(storage, `${user.uid}/posts`);
        const postFolders = await listAll(listRef);
        // postFolders.prefixes.map(folderRef)
        const all = await Promise.all(
          postFolders.prefixes.map(async (folderRef) => {
            const thumbnailFolderRef = ref(folderRef, "thumbnail");
            const items = await listAll(thumbnailFolderRef);
            if (items.items.length > 0) {
              const url = await getDownloadURL(items.items[0]);
              return url;
            }
          })
        );
        setAllUrls(all)
        console.log(all);

        // listAll(listRef)
        //   .then((res) => {
        //     res.prefixes.forEach((folderRef) => {
        //       const thumbnailFolderRef = ref(folderRef, "thumbnail");
        //       listAll(thumbnailFolderRef).then((res2) => {
        //         res2.items.forEach((itemRef) => {
        //           console.log(itemRef.name);
        //           getDownloadURL(itemRef).then((url) => {
        //             urls.push(url);
        //           });
        //         });
        //       });
        //     });
        //     setAllUrls(urls);
        //   })
        //   .catch((error) => {
        //     // Uh-oh, an error occurred!
        //   });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [user, storage]);

  return (
    <div>
      {allUrls.map((url) => {
        return <Link to={'/upload'}><img src={url} key={url} alt="Thumbnail" style={{ maxWidth: "400px", maxHeight: "225px", padding: "20px"}}/></Link>;
      })}
    </div>
  );
};

export default ExplorePage;

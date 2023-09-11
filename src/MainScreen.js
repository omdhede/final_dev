import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/storage";
import "./cssFiles/MainScreen.css"
import * as THREE from "three";

import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const MainScreen = () => {
  const [user, setUser] = useState(null);
  const storage = getStorage();
  const { title } = useParams();
  const [data, setData] = useState(null);

  // For the 3D model
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

  

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
        const fileFolderRef = ref(storage, `${user.uid}/posts/${title}/file`);
        const postFolders = await listAll(fileFolderRef);
        if (postFolders.items.length === 0) return;
        const fileUrl = await getDownloadURL(postFolders.items[0]);

        const descriptionFolderRef = ref(
          storage,
          `${user.uid}/posts/${title}/description`
        );
        const descriptionFolders = await listAll(descriptionFolderRef);
        if (postFolders.items.length === 0) return;
        const descriptionUrl = await getDownloadURL(
          descriptionFolders.items[0]
        );

        const thumbnailFolderRef = ref(
          storage,
          `${user.uid}/posts/${title}/thumbnail`
        );
        const thumbnailFolders = await listAll(thumbnailFolderRef);
        if (thumbnailFolders.items.length === 0) return;
        const thumbnailUrl = await getDownloadURL(thumbnailFolders.items[0]);
        setData({ fileUrl, descriptionUrl, thumbnailUrl, text: "" });

        const response = await fetch(descriptionUrl);
        const text = await response.text();

        setData({ fileUrl, descriptionUrl, thumbnailUrl, text });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [user, storage, title]);

  useEffect(() => {
    const modelUrl = data?.fileUrl;

    if (!canvasRef.current) {
      console.error("Canvas element not ready");
      return;
    }

    const scene = new THREE.Scene();
    const canvas = canvasRef.current;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      scene.add(model);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight.position.set(0, 10, 5);
      scene.add(directionalLight);

      camera.position.z = 10;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;

      animate();
    });

    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        modelRef.current.rotation.y += 0.0002;
      }

      // Check if canvasRef.current exists before updating camera and rendering
      if (canvasRef.current) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        renderer.render(scene, camera);
      }
    };

    const handleResize = () => {
      if (canvasRef.current) {
        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [data]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>{title}</p>
      <p>{data?.fileUrl}</p>
      <p>{user?.displayName}</p>

      <p>{data?.descriptionUrl}</p>
      <canvas ref={canvasRef} id="myThreeJsCanvas"></canvas>
      <div>
        <img
          src={data?.thumbnailUrl}
          alt="Thumbnail"
          style={{
            maxWidth: "400px",
            maxHeight: "300px",
            padding: "20px",
          }}
        />
      </div>
    </div>
  );
};

export default MainScreen;

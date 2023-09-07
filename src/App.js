import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Login"
import Register from "./Register";
import PostUpload from "./PostUpload";
import ExplorePage from "./ExplorePage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/upload",
      element: <PostUpload />,
    },
    {
      path: "/explore",
      element: <ExplorePage />,
    },
  ]);
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
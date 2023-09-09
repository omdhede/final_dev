import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Login"
import Register from "./Register";
import PostUpload from "./PostUpload";
import ExplorePage from "./ExplorePage";
import MainScreen from "./MainScreen";

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
    {
      path: "/main/:title",
      element: <MainScreen />,
    },
  ]);
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
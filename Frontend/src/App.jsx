import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";

const App = () => {
  return (
    <div>
      <Routes className="h-screen flex items-center justify-center bg-gray-100">
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/notes"
            element={
              <>
                <Navbar />
                <Notes />
              </>
            }
          />
        </Route>
        <Route path="/profile" element={ <Profile />} />
      </Routes>
    </div>
  );
};

export default App;

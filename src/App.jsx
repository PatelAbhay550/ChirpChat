import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Create from "./pages/Create";
import LoadingBar from "react-top-loading-bar";
import Profile from "./pages/Profile";
import Fulltweet from "./pages/Fulltweet";

function App() {
  const [progress, setProgress] = useState(0);
  const barColor = "#36D7B7";
  useEffect(() => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, [setProgress]);
  return (
    <Router>
      <>
        <LoadingBar color={barColor} progress={progress} />
        <Routes>
          <Route path="/login" element={<Login setProgress={setProgress} />} />
          <Route path="/:username/:id" element={<Fulltweet />} />
          <Route
            path="/user/:id"
            element={<Profile setProgress={setProgress} />}
          />
          <Route path="/" element={<Home setProgress={setProgress} />} />
          <Route
            path="/create"
            element={<Create setProgress={setProgress} />}
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import styles from "./Navbar.module.css";
import { auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const img =
    user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const handleLogoClick = () => {
    // Navigate to the root route when the logo is clicked
    navigate("/");
  };

  const handleModeToggle = () => {
    // Toggle dark mode
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Implement logic to change the theme, for example, by updating CSS classes
    document.body.classList.toggle("dark-mode", newDarkMode);

    // Update the background color of the main div in the Navbar
    const mainDiv = document.querySelector(`.${styles.main}`);
    if (mainDiv) {
      mainDiv.style.backgroundColor = newDarkMode ? "#333" : "#fff";
    }
  };

  return (
    <div className={styles.main}>
      <Link to={`/user/${user?.uid}`}>
        <img
          className={styles.img}
          src={img}
          alt="userimg"
          width={40}
          height={40}
        />
      </Link>
      <Link to="/">
        <img
          className={styles.img}
          src="/logo.svg"
          alt="logo"
          width={40}
          height={40}
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
      </Link>
      {/* Toggle between dark and light mode icons based on the state */}
      {darkMode ? (
        <MdLightMode color="#fff" onClick={handleModeToggle} />
      ) : (
        <MdDarkMode color="#000" onClick={handleModeToggle} />
      )}
    </div>
  );
};

export default Navbar;

import React, { useEffect } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase"; // Import your Firebase config
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate("/");
      // The user is now logged in, and their data is available in the 'user' variable
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // useEffect to check the user's authentication state
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        console.log(user);
        // You can save the user data or navigate to another page
        navigate("/");
      } else {
        // User is signed out
        console.log("no user");
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigate]);
  onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        // User is signed in
        console.log("User is signed in:", user);

        // Here you can save the user data to session storage or local storage if needed
      } else {
        // User is signed out
        console.log("User is signed out");
      }
    },
    { persistence: "local" }
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Welcome to ChirpChat
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Connect and chat with friends on ChirpChat. Join our community now!
        </p>
        {auth.currentUser ? (
          // User is logged in
          <>
            <p>Welcome, {auth.currentUser.displayName}!</p>
            <button>Enjoy Chirping;)</button>
          </>
        ) : (
          // User is not logged in
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            <FaUser /> Login With Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;

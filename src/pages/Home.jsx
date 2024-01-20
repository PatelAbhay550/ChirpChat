import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { IoCreateSharp } from "react-icons/io5";
import ChirpCard from "../components/ChirpCard";
import { auth } from "../config/firebase";
import { Link } from "react-router-dom";

const Home = ({ setProgress }) => {
  document.title = "ChirpChat";
  const user = auth.currentUser;
  useEffect(() => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, [setProgress]);
  return (
    <>
      <div className="nav ">
        <Navbar user={user} />
      </div>
      <div className="cards mt-24">
        <ChirpCard />

      </div>
      <Link to="/create">
        <div className="createbtn  fixed right-5 rounded-full bottom-8 w-16 h-16">
          <IoCreateSharp className="createnav" />
        </div>
      </Link>
    </>
  );
};

export default Home;

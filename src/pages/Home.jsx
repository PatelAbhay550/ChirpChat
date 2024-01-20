import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { IoCreateSharp } from "react-icons/io5";
import ChirpCard from "../components/ChirpCard";
import { auth } from "../config/firebase";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>ChirpChat</title>
        <meta content="ChirpChat" property="og:site_name"></meta>
        <meta
          content="https://firebasestorage.googleapis.com/v0/b/myblog-aee44.appspot.com/o/tweetimgs%2Fchirpchat.png?alt=media&token=5cb1ae4e-a682-429b-a573-f9bd4e59e021"
          property="og:image"
        ></meta>
        <meta
          name="description"
          content="ChirpChat - Where conversations take flight! Engage in dynamic and real-time social messaging with ChirpChat. Join the community and let your thoughts soar"
        />
        <meta name="keywords" content="Chirpchat,Social media" />
      </Helmet>
      <div className="nav ">
        <Navbar user={user} />
      </div>
      <div className="cards mt-24">
        <ChirpCard />
        <ChirpCard />
        <ChirpCard />
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

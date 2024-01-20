import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const Create = ({ setProgress }) => {
  const navigate = useNavigate();
  const [tweetText, setTweetText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, [setProgress]);

  const handleTextChange = (e) => {
    setTweetText(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImageFile(selectedImage);

      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, "/tweetimgs/" + imageFile.name);
      await uploadBytes(storageRef, imageFile);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      const userEmail = auth.currentUser.email;
      const userName = userEmail.substring(0, userEmail.indexOf("@"));
      const tweetRef = doc(collection(db, "tweetdata"));

      // Regular expression to find the first link in tweetText
      const linkRegex = /(http[s]?:\/\/[^\s]+)/gi;
      const linkMatches = tweetText.match(linkRegex);
      const linkUrl = linkMatches ? linkMatches[0] : null;

      const tweetData = {
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        username: auth.currentUser.displayName,
        userhandle: userName,
        userimg: auth.currentUser.photoURL,
        tweetText,
        imageSrc: imageUrl,
        linkUrl, // Include the link in the tweet data
        email: auth.currentUser.email,
        id: tweetRef.id,
      };

      // Add tweet data to the 'tweetdata' collection
      await addDoc(collection(db, "tweetdata"), tweetData);

      navigate("/");

      // Clear the form after submission
      setTweetText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating tweet:", error);
    }
  };

  if (!auth?.currentUser) {
    navigate("/login");
    return null; // Ensure the component does not render if the user is not authenticated
  }

  return (
    <>
      <div className="nav pt-2 pl-2 w-full h-12">
        <Link to="/">
          <IoIosArrowRoundBack className="text-4xl" />
        </Link>
      </div>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
        <img
          src={auth?.currentUser?.photoURL}
          style={{ borderRadius: "50%", margin: "0 auto", width: "50px" }}
          alt="user"
        />
        <h2 className="text-2xl font-semibold mb-4">Create Chirps</h2>
        <form onSubmit={handleTweetSubmit}>
          <textarea
            className="w-full p-2 mb-4 border rounded-md"
            value={tweetText}
            onChange={handleTextChange}
            placeholder="What's happening?"
          />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="mb-4"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              style={{ maxWidth: "100%", marginBottom: "16px" }}
            />
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Tweet
          </button>
        </form>
      </div>
    </>
  );
};

export default Create;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Helmet } from "react-helmet";

import {
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { formatDistanceToNow } from "date-fns";

const Fulltweet = () => {
  const { id } = useParams();
  const [tweetData, setTweetData] = useState(null);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const tweetCollectionRef = collection(db, "tweetdata");
        const tweetQuery = query(tweetCollectionRef, where("id", "==", id));
        const tweetDocs = await getDocs(tweetQuery);

        if (!tweetDocs.empty) {
          // Assuming you only expect one document, get the first one
          const tweetDoc = tweetDocs.docs[0];
          const tweetData = tweetDoc.data();
          setTweetData(tweetData);

          // Set title and OG tags dynamically
          // document.title =
          //   "Tweet by " + tweetData.username + ": " + tweetData.tweetText;
          // const metaDescriptionTag = document.querySelector(
          //   'meta[name="description"]'
          // );
          // if (metaDescriptionTag) {
          //   metaDescriptionTag.setAttribute("content", tweetData.tweetText);
          // }
        } else {
          console.error("Tweet not found");
          // Handle tweet not found case
        }
      } catch (error) {
        console.error("Error fetching tweet data:", error);
      }
    };

    fetchTweet();
  }, [id]);

  const formatTimeAgo = (timestamp) => {
    const currentDate = new Date();
    const tweetDate = timestamp.toDate(); // Assuming timestamp is a Firestore timestamp
    return formatDistanceToNow(tweetDate, { addSuffix: true });
  };

  return (
    <>
      <Helmet>
        <title>
          {`${tweetData?.username} on Chirpchat ${tweetData?.tweetText}`}
        </title>
        <meta content={`${tweetData?.imageSrc}`} property="og:image"></meta>
        <meta name="description" content={`${tweetData?.tweetText}`} />
        <meta
          content={`${tweetData?.tweetText}`}
          property="og:title"
          data-rh="true"
        />
      </Helmet>
      <div className="nav pt-2 pl-2 w-full h-12">
        <Link to="/">
          <IoIosArrowRoundBack className="text-4xl" />
        </Link>
      </div>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
        {tweetData && (
          <>
            <div className="flex items-center mb-4">
              <img
                src={tweetData.userimg}
                alt="User"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{tweetData.username}</h2>
                <p className="text-gray-600">@{tweetData.userhandle}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">{tweetData.tweetText}</p>
            </div>

            <div className="text-gray-500">
              {formatTimeAgo(tweetData.timestamp)}
            </div>

            {tweetData.imageSrc && (
              <div className="mt-4">
                <img
                  src={tweetData.imageSrc}
                  alt="Tweet Image"
                  className="rounded-md"
                />
              </div>
            )}

            <div className="mt-4">
              <Link to={`/user/${tweetData.userId}`}>View Profile</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Fulltweet;

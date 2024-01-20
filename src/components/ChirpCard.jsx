import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import styles from "./Chirpcard.module.css";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";

const ChirpCard = () => {
  const [tweetData, setTweetData] = useState([]);

  useEffect(() => {
    const fetchTweetData = async () => {
      try {
        const tweetCollection = collection(db, "tweetdata");
        const tweetSnapshot = await getDocs(tweetCollection);
        const tweetDataArray = tweetSnapshot.docs.map((doc) => doc.data());
        setTweetData(tweetDataArray);
      } catch (error) {
        console.error("Error fetching tweet data:", error);
      }
    };

    fetchTweetData();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const currentDate = new Date();
    const tweetDate = timestamp?.toDate(); // Assuming timestamp is a Firestore timestamp
    return formatDistanceToNow(tweetDate, { addSuffix: true });
  };

  return (
    <>
      {tweetData.map((tweet, index) => (
        <Link
          to={`/${tweet.userhandle}/${tweet.id}`}
          key={index}
          className={styles.link}
        >
          <div key={index} className={styles.twittercard}>
            <div className={styles.userinfo}>
              <Link to={`/user/${tweet.userId}`}>
                <img
                  src={tweet.userimg}
                  alt="User img"
                  className={styles.userimage}
                  width={20}
                  height={40}
                />
              </Link>
              <div className={styles.userdetails}>
                <div className="one">
                  <div className={styles.username}>{tweet.username}</div>
                  <Link to={`/user/${tweet.userId}`}>
                    <div
                      className={styles.userhandle}
                    >{`@${tweet.userhandle}`}</div>
                  </Link>
                </div>
              </div>
              <div className={styles.chirptime}>
                {formatTimeAgo(tweet.timestamp)}
              </div>
            </div>

            <div className={styles.chirpcontent}>{tweet.tweetText}</div>
            <div className={styles.chirpimgcont}>
              {tweet.imageSrc && (
                <img
                  src={tweet.imageSrc}
                  alt="chirp img"
                  className={styles.chirpimage}
                  style={{ objectPosition: "top" }}
                  width={100}
                  height={100}
                />
              )}
              {tweet.linkUrl && (
                <a
                  href={tweet.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {tweet.linkUrl}
                </a>
              )}
            </div>

            <div className={styles.interactionicons}>
              <div className={styles.interactionicon}>
                <div className="icon">&#x2665;</div>0
              </div>
              <div className={styles.interactionicon}>
                <div className="icon">&#x21A9;</div>0
              </div>
              <div className={styles.interactionicon}>
                <div className="icon">&#x1F4AC;</div>6
              </div>
              <div className={styles.interactionicon}>
                <div className="icon">&#x1F4E5;</div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default ChirpCard;

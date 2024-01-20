import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import styles from "../components/Chirpcard.module.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const Profile = ({ setProgress }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, [setProgress]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data based on the 'id' parameter
        const userSnapshot = await getDocs(
          query(collection(db, "tweetdata"), where("userId", "==", id))
        );

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0].data();
          setUserData(userDoc);

          // Fetch user's tweets using the userId from tweetdata
          const tweetsSnapshot = await getDocs(
            query(
              collection(db, "tweetdata"),
              where("userId", "==", id),
              orderBy("timestamp", "desc")
            )
          );

          const tweetsData = tweetsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUserTweets(tweetsData);
        } else {
          // If the user doesn't have tweets, set an empty array
          setUserTweets([]);
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchUserData();
  }, [id]);

  const formatTimeAgo = (timestamp) => {
    const currentDate = new Date();
    const tweetDate = timestamp.toDate(); // Assuming timestamp is a Firestore timestamp
    return formatDistanceToNow(tweetDate, { addSuffix: true });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!auth.currentUser) {
    navigate("/");
  }

  return (
    <>
      {" "}
      <div className="nav pt-2 pl-2 w-full h-12">
        <Link to="/">
          <IoIosArrowRoundBack className="text-4xl" />
        </Link>
      </div>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
        {userData && (
          <>
            <div className="flex items-center mb-4">
              <img
                src={userData?.userimg}
                alt="User"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{userData?.username}</h2>
                <p className="text-gray-600">{userData?.email}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Tweets by {userData?.username}
            </h3>

            {/* Mapped Tweets */}
            {userTweets.map((tweet) => (
              <div key={tweet.id} className={styles.twittercard}>
                <div className={styles.userinfo}>
                  <Link to={`/user/${tweet.username}`}>
                    <img
                      src={tweet.userimg}
                      alt="User img"
                      className={styles.userimages}
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
                  <div
                    className={styles.chirptime}
                    style={{ fontSize: "10px" }}
                  >
                    {formatTimeAgo(tweet.timestamp)}
                  </div>
                </div>

                <div className={styles.chirpcontent}>{tweet.tweetText}</div>
                {tweet.imageSrc && (
                  <div className={styles.chirpimgcont}>
                    <img
                      src={tweet.imageSrc}
                      alt="chirp img"
                      className={styles.chirpimage}
                      width={100}
                      style={{ objectPosition: "top" }}
                      height={100}
                    />
                  </div>
                )}

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
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Profile;

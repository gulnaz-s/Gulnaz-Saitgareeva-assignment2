import Profile from "./Profile";
import Feed from "./Feed";
import TweetComposer from "./TweetComposer";

import styles from "./UserFeedPage.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./control/context";
import { useParams } from "react-router";
import { apiGetUserFeed } from "./control/api";
import LoadingPage from "./LoadingPage";

const UserFeedPage = () => {
  const auth = useContext(AuthContext);
  const { username } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGetUserFeed(username).then(({ success, data, error }) => {
      if (success) {
        setData(data);
      } else {
        setError(error);
      }
    });
  }, [username]);

  const handleTweetAdded = (tweet) => {
    const newFeed = [tweet, ...data.feed];
    setData({ ...data, feed: newFeed });
  };
  
  if (error != null) {
    return <div className={styles.error}>{error}</div>;
  }

  if (data == null) {
    return <LoadingPage />;
  }


  const { user, feed } = data;

  return (
    <div className={styles.container}>
      <Profile
        username={username}
        joinTimestamp={user.joined}
        description={user.description}
      />
      {auth.user === username && (
        <TweetComposer onTweetAdded={handleTweetAdded} />
      )}
      <Feed tweets={feed} />
    </div>
  );
};

export default UserFeedPage;

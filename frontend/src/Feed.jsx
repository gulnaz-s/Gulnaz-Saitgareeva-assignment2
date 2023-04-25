import { useContext } from "react";

import Tweet from "./Tweet";
import { AuthContext } from "./control/context";

import styles from "./Feed.module.css";

const Feed = ({ tweets }) => {
  const auth = useContext(AuthContext);

  return (
    <div className={styles.feed}>
      <h2>Recent Tweets</h2>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          editable={auth.user === tweet.username}
          {...tweet}
        />
      ))}
    </div>
  );
};

export default Feed;

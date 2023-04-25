import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../control/context";
import { URL_GLOBAL_FEED, URL_USERS, URL_USER_FEED } from "../control/url";
import styles from "./Links.module.css";

const Links = () => {
  const auth = useContext(AuthContext);
  const isLoggedIn = auth.user != null;

  return (
    <ul className={styles.topLinks}>
      {isLoggedIn && (
        <Link
          to={URL_USER_FEED.replace(":username", auth.user)}
          className={styles.link}
        >
          Your page
        </Link>
      )}
      <Link to={URL_GLOBAL_FEED} className={styles.link}>
        Global feed
      </Link>
      <Link to={URL_USERS} className={styles.link}>
        All users
      </Link>
    </ul>
  );
};

export default Links;

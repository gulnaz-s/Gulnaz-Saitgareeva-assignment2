import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetUsers } from "./control/api";
import { URL_USER_FEED } from "./control/url";
import LoadingPage from "./LoadingPage";

import styles from "./UsersPage.module.css";

const Item = ({ username, description, joined }) => {
  const joinedDate = new Date(1000 * joined);
  const joinedDateText = `Joined: ${joinedDate.toLocaleDateString()}`;

  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <Link
          to={URL_USER_FEED.replace(":username", username)}
          className={styles.username}
        >
          @{username}
        </Link>
        <div className={styles.dateJoined}>{joinedDateText}</div>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

const UsersPage = () => {
  const [users, setUsers] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    apiGetUsers().then(({ success, data, error }) => {
      if (success) {
        setUsers(data.users);
      } else {
        setError(error);
      }
    });
  }, []);

  if (error != null) {
    return <div className={styles.error}>{error}</div>;
  }

  if (users == null) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.container}>
      <h2>All users</h2>
      {users.map((user) => (
        <Item key={user.username} {...user} />
      ))}
    </div>
  );
};

export default UsersPage;

import UserDescription from "./UserDescription";
import styles from "./Profile.module.css";
import { useContext } from "react";
import { AuthContext } from "./control/context";

const Profile = ({ username, joinTimestamp, description }) => {
  const auth = useContext(AuthContext);

  const joinedDate = new Date(1000 * joinTimestamp);
  const joinedDateText = `Joined: ${joinedDate.toLocaleDateString()}`;

  return (
    <div className={styles.profile}>
      <div className={styles.username}>{`@${username}`}</div>
      <div className={styles.dateJoined}>{joinedDateText}</div>
      <UserDescription
        description={description}
        editable={auth.user === username}
      />
    </div>
  );
};

export default Profile;

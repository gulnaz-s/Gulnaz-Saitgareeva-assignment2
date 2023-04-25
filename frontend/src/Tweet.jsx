import { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { apiDeleteTweet, apiEditTweet, apiRestoreTweet } from "./control/api";
import { AuthContext } from "./control/context";
import { URL_USER_FEED } from "./control/url";
import { showError } from "./utils";

import styles from "./Tweet.module.css";

const Tweet = ({ id, username, timestamp, message }) => {
  const auth = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiEditTweet(id, currentMessage.trim()).then(({ success, error }) => {
      if (!success) {
        showError(error);
        setIsEditing(true);
      }
    });
    setCurrentMessage(currentMessage.trim());
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    apiDeleteTweet(id).then(({ success, error }) => {
      if (!success) {
        showError(error);
        setIsDeleted(false);
      }
    });
    setIsDeleted(true);
  };

  const handleUndoDeleteClick = (e) => {
    e.preventDefault();
    apiRestoreTweet(id).then(({ success, error }) => {
      if (!success) {
        showError(error);
        setIsDeleted(true);
      }
    });
    setIsDeleted(false);
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isEditing) return;
    textareaRef.current.style.height = "0";
    const scrollHeight = textareaRef.current.scrollHeight;
    const textareaHeight = Math.max(scrollHeight, 60);
    textareaRef.current.style.height = `${textareaHeight}px`;
  }, [isEditing, currentMessage]);

  let content = null;
  const isOwned = auth.user === username;

  if (isDeleted) {
    content = (
      <p className={styles.deletedText}>
        This tweet has been deleted
        {isOwned && (
          <>
            &nbsp; (
            {
              <a
                href="#"
                className={styles.undoLink}
                onClick={handleUndoDeleteClick}
              >
                restore
              </a>
            }
            )
          </>
        )}
      </p>
    );
  } else if (isOwned && isEditing) {
    content = (
      <form className={styles.tweetForm} onSubmit={handleSubmit}>
        <textarea
          required
          autoFocus
          className={styles.tweetInput}
          value={currentMessage}
          ref={textareaRef}
          onInput={handleChange}
          maxLength="140"
        />
        <button className={styles.submitButton} type="submit">
          Submit
        </button>
      </form>
    );
  } else {
    content = <p className={styles.tweetText}>{currentMessage}</p>;
  }

  let actionsBlock = null;
  if (isOwned && !isDeleted && !isEditing) {
    actionsBlock = (
      <div className={styles.tweetActions}>
        <a href="#" className={styles.editLink} onClick={handleEditClick}>
          Edit
        </a>{" "}
        <a href="#" className={styles.deleteLink} onClick={handleDeleteClick}>
          Delete
        </a>
      </div>
    );
  }

  const date = new Date(timestamp * 1000).toLocaleDateString();

  return (
    <div className={styles.tweet}>
      <div className={styles.tweetHeader}>
        <Link
          to={URL_USER_FEED.replace(":username", username)}
          className={styles.tweetUsername}
        >
          {`@${username}`}
        </Link>
        <p className={styles.tweetDate}>Posted on {date}</p>
      </div>
      {content}
      {actionsBlock}
    </div>
  );
};

export default Tweet;

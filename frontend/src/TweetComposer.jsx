import { useState, useEffect, useRef } from "react";
import { apiPostTweet } from "./control/api";
import styles from "./TweetComposer.module.css";

import { showError } from "./utils"

const TweetComposer = ({ onTweetAdded }) => {
  const [tweetText, setTweetText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setTweetText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    apiPostTweet(tweetText.trim()).then(({success, data, error}) => {
      if (success) {
        onTweetAdded(data.tweet);
        setTweetText("");
        setIsSubmitting(false);
      } else {
        showError(error);
      }
    });
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.style.height = "0";
    const scrollHeight = textareaRef.current.scrollHeight;
    const textareaHeight = Math.max(scrollHeight, 60);
    textareaRef.current.style.height = `${textareaHeight}px`;
  }, [tweetText]);

  let overlay = null;
  if (isSubmitting) {
    overlay = (
      <div className={styles.overlay}>
        <div className={styles.spinner}>
          <i className={`fas fa-spinner ${styles.spinnerIcon}`}></i>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.tweetComposer} onSubmit={handleSubmit}>
      <textarea
        required
        className={styles.tweetInput}
        placeholder="What's happening?"
        value={tweetText}
        ref={textareaRef}
        onChange={handleChange}
      />
      <button className={styles.tweetButton} type="submit">
        Send
      </button>
      {overlay}
    </form>
  );
};

export default TweetComposer;

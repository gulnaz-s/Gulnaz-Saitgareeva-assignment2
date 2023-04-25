import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { apiSignUp } from "./control/api";
import { AuthDispatchContext } from "./control/context";
import { URL_USER_FEED } from "./control/url";
import { ACTION_SET_AUTH_USER } from "./control/authState";
import styles from "./SignUpPage.module.css";

const SignUpPage = () => {
  const dispatchAuthState = useContext(AuthDispatchContext);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    apiSignUp(username, password).then(({ success, data, error }) => {
      if (success) {
        const { username } = data.user;
        dispatchAuthState({
          type: ACTION_SET_AUTH_USER,
          username,
        });
        navigate(URL_USER_FEED.replace(":username", username));
      } else {
        setError(error);
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2>Sign Up</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputFields}>
          <label className={styles.label}>
            Username
            <input
              required
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              required
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;

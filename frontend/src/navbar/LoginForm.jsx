import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiGetCurrentUser, apiLogIn, apiLogOut } from "../control/api";
import {
  ACTION_LOGOUT,
  ACTION_SET_AUTH_USER,
} from "../control/authState";
import { AuthContext, AuthDispatchContext } from "../control/context";
import { URL_SIGNUP } from "../control/url";
import { showError } from "../utils"
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const { user } = useContext(AuthContext);
  const dispatchAuthState = useContext(AuthDispatchContext);

  const navigate = useNavigate();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    apiGetCurrentUser().then(({ success, data }) => {
      if (success && data.user != null) {
        dispatchAuthState({
          type: ACTION_SET_AUTH_USER,
          username: data.user.username,
        });
      }
    });
  }, []);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleCancelClick = () => {
    setShowLoginForm(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    apiLogIn(username, password).then(({success, data, error}) => {
      setIsSubmitting(false);
      if (success) {
        setUsername("");
        setPassword("");
        setShowLoginForm(false);
        setIsError(false);
        dispatchAuthState({
          type: ACTION_SET_AUTH_USER,
          username: data.user.username,
        });
      } else {
        showError(error);
        setIsError(true);
      }
    });
  };

  const handleLogoutClick = () => {
    dispatchAuthState({ type: ACTION_LOGOUT });
    apiLogOut().then(({ success, error }) => {
      if (!success) {
        showError(error);
      }
    });
  };

  if (isSubmitting) {
    return (
      <div className={styles.loginForm}>
        <span className={styles.welcomeText}>Logging in...</span>
      </div>
    );
  }

  if (user !== null) {
    return (
      <div className={styles.loginForm}>
        <div className={styles.welcomeText}>Welcome, @{user}</div>
        <button className={styles.formButton} onClick={handleLogoutClick}>
          Log out
        </button>
      </div>
    );
  }

  if (showLoginForm) {
    return (
      <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
        <input
          required
          autoFocus={!isError}
          className={
            styles.formInput + (isError ? ` ${styles.errorInput}` : "")
          }
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          required
          className={
            styles.formInput + (isError ? ` ${styles.errorInput}` : "")
          }
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className={styles.formButton} type="submit">
          Log in
        </button>
        <button className={styles.formButton} onClick={handleCancelClick}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className={styles.loginForm}>
      <button className={styles.formButton} onClick={handleLoginClick}>
        Log in
      </button>
      <button
        className={styles.formButton}
        onClick={() => navigate(URL_SIGNUP)}
      >
        Sign up
      </button>
    </div>
  );
};

export default LoginForm;

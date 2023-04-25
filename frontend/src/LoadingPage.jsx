import styles from "./LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.page}>
      <i className={`${styles.spinnerIcon} fas fa-spinner`} />
    </div>
  );
};

export default LoadingPage;

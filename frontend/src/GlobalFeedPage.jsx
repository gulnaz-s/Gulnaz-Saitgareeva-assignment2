import { useEffect, useState } from 'react';
import { apiGetGlobalFeed } from './control/api';
import Feed from './Feed';

import styles from './GlobalFeedPage.module.css';
import LoadingPage from './LoadingPage';

const GlobalFeedPage = () => {
  const [feed, setFeed] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    apiGetGlobalFeed().then(({success, data, error}) => {
      if (success) {
        setFeed(data.feed);
      } else {
        setError(error);
      }
    });
  }, []);

  if (error != null) {
    return <div className={styles.error}>{error}</div>;
  }

  if (feed == null) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.container}>
      <Feed tweets={feed} />
    </div>
  );
};

export default GlobalFeedPage;

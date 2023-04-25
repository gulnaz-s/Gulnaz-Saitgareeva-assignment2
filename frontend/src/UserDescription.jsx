import { useState } from 'react';
import { apiUpdateDescription } from './control/api';
import { showError } from './utils';
import styles from './UserDescription.module.css';

const UserDescription = ({ description, editable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDescription, setCurrentDescription] = useState(description);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiUpdateDescription(currentDescription).then(({ success, error }) => {
      if (!success) {
        showError(error);
        setIsEditing(true);
      }
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setCurrentDescription(e.target.value);
  };

  return (
    <div className={styles.description}>
      {(editable && isEditing) ? (
        <form className={styles.descriptionForm} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.descriptionInput}
            value={currentDescription}
            maxLength={140}
            onChange={handleChange}
          />
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </form>
      ) : currentDescription != "" ? (
        <span>{currentDescription}</span>
      ) : (
        <span className={styles.noDescription}>No description</span>
      )}
      {editable && !isEditing && (
        <i
          className={`fas fa-pencil-alt ${styles.editIcon}`}
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default UserDescription;

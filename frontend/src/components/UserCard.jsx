import styles from '../styles/UserCard.module.css';

const UserCard = ({ picture, name }) => (
  <div className={styles.userCard}>
    <span className={styles.name}>{name}</span>{' '}
    {picture &&
      <img
        src={picture}
        width="40px" height="40px"
        alt={`${name}'s avatar`}
        className={styles.profPhoto}
      />
    }
  </div>
);

export default UserCard;

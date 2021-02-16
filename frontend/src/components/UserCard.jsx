import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/UserCard.module.css';

const UserCard = ({ picture, name }) => (
  <div className={styles.userCard}>
    <span className={styles.name}>{name}</span>
    {' '}
    {
      picture
      && (
        <img
          src={picture}
          width="40px"
          height="40px"
          alt={`${name}'s avatar`}
          className={styles.profPhoto}
        />
      )
    }
  </div>
);

UserCard.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
};

// TODO use default picture URL
UserCard.defaultProps = {
  picture: '',
};

export default UserCard;

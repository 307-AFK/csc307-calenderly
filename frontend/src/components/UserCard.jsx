import React from 'react';
import PropTypes from 'prop-types';

import { Avatar } from 'antd';
import styles from '../styles/UserCard.module.css';

const UserCard = ({ children, picture, name }) => (
  <div className={styles.userCard}>
    <Avatar src={picture} alt={`${name}'s avatar`} />
    <span className={styles.info}>{children}</span>
  </div>
);

UserCard.propTypes = {
  children: PropTypes.node.isRequired,
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
};

// TODO use default picture URL
UserCard.defaultProps = {
  picture: '',
};

export default UserCard;

import React from 'react';
import PropTypes from 'prop-types';

import { PageHeader, Button } from 'antd';

const Profile = (props) => {
  const { user } = props;
  const { picture, name, email } = user;

  return (
    <>
      <PageHeader
        title='Profile'
        subTitle='all about you!'
      />
      <div className='content'>
        <img
          src={picture}
          alt={`${name}'s profile`}
          width='80'
          height='80'
        />
        <h2>{name}</h2>
        <p>{email}</p>
        <Button
          type='primary'
          href={`${process.env.REACT_APP_SERVER_URL}/auth/logout`}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

// TODO set default profile picture

export default Profile;

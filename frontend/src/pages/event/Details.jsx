import React from 'react';
import PropTypes from 'prop-types';

import { Avatar, Tooltip } from 'antd';

const splitEE = ([hd, ...tl], signed = [], unsigned = []) => {
  if (hd === undefined) return [signed, unsigned];
  if (hd.timeChosen) {
    signed.push(hd);
    return splitEE(tl, signed, unsigned);
  }
  unsigned.push(hd);
  return splitEE(tl, signed, unsigned);
};

const UserCircle = ({ name, src }) => (
  <Tooltip title={name} placement='bottom'>
    <Avatar src={src} />
  </Tooltip>
);

const Details = (props) => {
  const { event } = props;

  const [assigned, unassigned] = splitEE(event.interviewees);

  console.log(assigned, unassigned);

  return (
    <>
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <h2>Interviewees Signed Up</h2>
      {assigned.map((user) => (
        <UserCircle name={user.userId.name} src={user.userId.picture} />
      ))}

      <h2>Interviewees Not Signed Up</h2>
      <Avatar.Group>
        {unassigned.map((user) => (
          <UserCircle name={user.userId.name} src={user.userId.picture} />
        ))}
      </Avatar.Group>
    </>
  );
};

UserCircle.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

Details.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    interviewees: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default Details;

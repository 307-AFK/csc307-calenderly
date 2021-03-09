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

const Details = (props) => {
  const { event } = props;

  const [assigned, unassigned] = splitEE(event.interviewees);
  const sortedAssigned = assigned.sort((a, b) => a.timeChosen > b.timeChosen);

  return (
    <>
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <h2>Interviewees Signed Up</h2>
      {sortedAssigned.map((user) => {
        const [day, time] = user.timeChosen.split('T00:');

        return (
          <div key={user._id}>
            <Avatar src={user.userId.picture} />
            <span>{`${user.userId.name} - ${day} @ ${time.substr(0, 5)}`}</span>
          </div>
        );
      })}

      <h2>Interviewees Not Signed Up</h2>
      <Avatar.Group>
        {unassigned.map((user) => (
          <Tooltip key={user._id} title={user.userId.name} placement='bottom'>
            <Avatar src={user.userId.picture} />
          </Tooltip>
        ))}
      </Avatar.Group>
    </>
  );
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

import React from 'react';
import PropTypes from 'prop-types';

import {
  Avatar,
  Tooltip,
  PageHeader,
  Divider,
} from 'antd';

import UserCard from '../../components/UserCard';

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
      <PageHeader title={event.title} />

      <div className='content'>
        <p>{event.description}</p>
        <Divider />

        <h2>Interviewees Signed Up</h2>
        {sortedAssigned.map((user) => {
          const [day, time] = user.timeChosen.split('T00:');
          const timeString = time.substring(0, 5);
          const infoString = `${user.userId.name}: ${day} @ ${timeString}`;

          return (
            <UserCard
              key={user._id}
              picture={user.userId.picture}
              name={user.userId.name}
            >
              {infoString}
            </UserCard>
          );
        })}

        <Divider />
        <h2>Interviewees Not Signed Up</h2>
        { unassigned.length > 0 ? (
          <Avatar.Group>
            {unassigned.map((user) => (
              <Tooltip key={user._id} title={user.userId.name} placement='bottom'>
                <Avatar src={user.userId.picture} />
              </Tooltip>
            ))}
          </Avatar.Group>
        ) : (
          <p>All current interviewees have signed up</p>
        )}
      </div>
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
        userId: PropTypes.shape({
          _id: PropTypes.string.isRequired,
        }),
      }),
    ),
  }).isRequired,
};

export default Details;

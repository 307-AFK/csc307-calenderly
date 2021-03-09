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

const VieweeTile = (props) => {
  const { datetime, user } = props;
  const [day, time] = datetime.split('T00:');
  const timeString = time.substring(0, 5);

  return (
    <UserCard picture={user.picture} name={user.name}>
      <span>{`${user.name}: `}</span>
      <b>{`${day} @ ${timeString}`}</b>
    </UserCard>
  );
};

// TODO group by day
const VieweePanel = ({ viewees }) => {
  const [assigned, unassigned] = splitEE(viewees);
  const sortedAssigned = assigned.sort((a, b) => a.timeChosen > b.timeChosen);

  return (
    <>
      <h3>Interviewees Signed Up</h3>
      { sortedAssigned.length > 0
        ? sortedAssigned.map((user) => (
          <VieweeTile
            key={user._id}
            user={user.userId}
            datetime={user.timeChosen}
          />
        )) : <em>No interviewees have signed up yet</em>}

      <Divider />
      <h3>Interviewees Not Signed Up</h3>
      { unassigned.length > 0 ? (
        <Avatar.Group>
          {unassigned.map((user) => (
            <Tooltip key={user._id} title={user.userId.name} placement='bottom'>
              <Avatar src={user.userId.picture} />
            </Tooltip>
          ))}
        </Avatar.Group>
      ) : <em>All Interviewees have signed up</em> }
    </>
  );
};

const Details = (props) => {
  const { userId, event } = props;

  const startdate = event.startDate.substr(0, 10);
  const enddate = event.startDate.substr(0, 10);

  const findViewer = event.interviewers.find((u) => u.userId === userId);
  const isViewer = findViewer !== undefined;
  const vieweeCount = event.interviewees.length;

  return (
    <>
      <PageHeader title={event.title} />

      <div className='content'>
        <p>{`${startdate} → ${enddate}`}</p>
        <p>{event.description}</p>

        <Divider />
        <h2>Interviewees</h2>
        {vieweeCount > 0
          ? <VieweePanel viewees={event.interviewees} isViewer={isViewer} />
          : <em>There are currently no interviewees</em>}
      </div>
    </>
  );
};

VieweeTile.propTypes = {
  datetime: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
};

VieweePanel.propTypes = {
  viewees: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }),
    }),
  ).isRequired,
};

Details.propTypes = {
  userId: PropTypes.string.isRequired,
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    interviewees: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.shape({
          _id: PropTypes.string.isRequired,
        }),
      }),
    ),
    interviewers: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.shape({
          _id: PropTypes.string.isRequired,
        }),
      }),
    ),
  }).isRequired,
};

export default Details;

import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const UpdateEvent = ({ user }) => {
  const { eventId } = useParams();

  const [eventInfo, updateEventInfo] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventId}`,
      { credentials: 'include' }).then((res) => res.json())
      .then((event) => {
        updateEventInfo(event);
      });
  }, []);

  if (!eventInfo.interviewers || !eventInfo.interviewers.some((u) => u.userId === user.id)) {
    return <div>You do not have permission to edit this event</div>;
  }
  return (
    <div>
      eventId:
      {eventId}
      <br />
      event:
      {eventInfo.title}
      <br />
      <Interviewers users={eventInfo.interviewers} />
    </div>
  );
};

const Interviewers = ({ users }) => (
  <>
    <div>Current Interviewers:</div>
    {
      users.map((i) => <Interviewer key={i} userId={i.userId} />)
    }
    <Button>
      Add interviewers
    </Button>
  </>
);

const Interviewer = ({ userId }) => {
  const [userInfo, updateUserInfo] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
      { credentials: 'include' }).then((res) => res.json())
      .then((user) => {
        updateUserInfo(user);
      });
  }, [userId]);

  return (
    <div>
      {userInfo.name}
      (
      {userInfo.email}
      )
    </div>
  );
};

UpdateEvent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

Interviewers.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({ userId: PropTypes.string }),
  ).isRequired,
};

Interviewer.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UpdateEvent;

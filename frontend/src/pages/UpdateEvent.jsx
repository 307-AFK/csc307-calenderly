import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Interviewers from '../components/Interviewers';
import Interviewees from '../components/Interviewees';

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

  if (!eventInfo || !eventInfo.interviewers
    || !eventInfo.interviewers.some((u) => u.userId === user.id)) {
    return <div>You do not have permission to edit this event</div>;
  }
  return (
    <>
      <h2>{eventInfo.title}</h2>
      (eventId:
      {eventId}
      )
      <br />
      <h2>Description:</h2>
      {eventInfo.description}
      <Interviewers
        currUserId={user.id}
        users={eventInfo.interviewers}
        updateEventInfo={updateEventInfo}
      />
      <Interviewees users={eventInfo.interviewees} updateEventInfo={updateEventInfo} />
    </>
  );
};

UpdateEvent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default UpdateEvent;

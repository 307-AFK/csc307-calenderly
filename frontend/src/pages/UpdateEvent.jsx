import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Interviewers from '../components/Interviewers';
import EventDetails from '../components/UpdateEventDetails';

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
    <div>
      <EventDetails
        updateEventInfo={updateEventInfo}
        eventInfo={eventInfo}
        eventId={eventId}
      />
      <Interviewers users={eventInfo.interviewers} />
    </div>
  );
};

UpdateEvent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default UpdateEvent;

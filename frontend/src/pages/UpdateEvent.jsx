import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Interviewers from '../components/Interviewers';
import Interviewees from '../components/Interviewees';
import EventDetails from '../components/UpdateEventDetails';
import style from '../styles/UpdateEventPage.module.css';

const UpdateEvent = ({ user }) => {
  const { id } = useParams();
  let userIdArr;
  const [eventInfo, updateEventInfo] = useState({});
  const eventLink = `${process.env.REACT_APP_SERVER_URL}/events/${id}`;

  useEffect(() => {
    fetch(eventLink, { credentials: 'include' })
      .then((res) => res.json())
      .then((event) => {
        updateEventInfo(event);
      });
  }, []);

  if (!eventInfo || !eventInfo.interviewers
    || !eventInfo.interviewers.some((u) => u.userId === user.id)) {
    return <div>You do not have permission to edit this event</div>;
  }
  // get array of user ids, but have to check if userIds has been populated. . .
  if (eventInfo.interviewees[0] && eventInfo.interviewees[0].userId._id) {
    userIdArr = eventInfo.interviewees.map((i) => i.userId._id);
  } else {
    userIdArr = eventInfo.interviewees.map((i) => i.userId);
  }
  return userIdArr && (
    <div className={style.page}>
      <EventDetails
        updateEventInfo={updateEventInfo}
        eventInfo={eventInfo}
        eventId={id}
      />

      <Interviewers
        currUserId={user.id}
        users={eventInfo.interviewers}
        updateEventInfo={updateEventInfo}
      />

      <Interviewees
        userIds={userIdArr}
        updateEventInfo={updateEventInfo}
      />
    </div>
  );
};

UpdateEvent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default UpdateEvent;

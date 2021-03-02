import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import EventCard from './EventCard';

const ScheduledEvents = ({ user }) => {
  const [interviewerEvents, updateInterviewerEvents] = useState([]);
  const [intervieweeEvents, updateIntervieweeEvents] = useState([]);

  const eventEndpoint = `${process.env.REACT_APP_SERVER_URL}/users/${user.id}/events`;

  useEffect(() => {
    fetch(`${eventEndpoint}/interviewer`, { credentials: 'include' })
      .then((res) => res.json())
      .then((events) => updateInterviewerEvents(events));

    fetch(`${eventEndpoint}/interviewee`, { credentials: 'include' })
      .then((res) => res.json())
      .then((events) => updateIntervieweeEvents(events));
  }, []);

  return (
    <>
      <h2>Interviewer</h2>
      {
        interviewerEvents.map((e) => (
          <EventCard key={e.eventId} event={e} isInterviewer />))
      }
      <Divider />
      <h2>Interviewee</h2>
      {
        intervieweeEvents.map((e) => (
          <EventCard key={e.eventId} event={e} />))
      }
    </>
  );
};

ScheduledEvents.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ScheduledEvents;

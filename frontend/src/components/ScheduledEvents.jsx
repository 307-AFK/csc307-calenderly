import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EventCard from './EventCard';

const ScheduledEvents = ({ user }) => {
  const [interviewerEvents, updateInterviewerEvents] = useState([]);
  const [intervieweeEvents, updateIntervieweeEvents] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${user.id}/events/interviewer`,
      { credentials: 'include' }).then((res) => res.json())
      .then((events) => {
        updateInterviewerEvents(events);
      });
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${user.id}/events/interviewee`,
      { credentials: 'include' }).then((res) => res.json())
      .then((events) => {
        updateIntervieweeEvents(events);
      });
  }, []);

  return (
    <>
      <div>
        ur an interviewer for these. . .
      </div>
      <InterviewerEvents events={interviewerEvents} />
      <br />
      <br />
      <div>
        ur an interviewee for these. . .
      </div>
      <IntervieweeEvents events={intervieweeEvents} />
    </>
  );
};

const InterviewerEvents = (props) => {
  const { events } = props;
  return (
    <>
      {
        events.map((e) => <EventCard key={e.eventId} event={e} isInterviewer />)
      }
    </>
  );
};

const IntervieweeEvents = (props) => {
  const { events } = props;
  return (
    <>
      {
        events.map((e) => <EventCard key={e.eventId} event={e} />)
      }
    </>
  );
};

ScheduledEvents.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

InterviewerEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({ eventId: PropTypes.string.isRequired })).isRequired,
};

IntervieweeEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({ eventId: PropTypes.string.isRequired })).isRequired,
};

export default ScheduledEvents;

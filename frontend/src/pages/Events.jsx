import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { PageHeader, Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/Events.less';

import EventCard from '../components/EventCard';

const Events = ({ user }) => {
  const [interviewerEvents, updateInterviewerEvents] = useState([]);
  const [intervieweeEvents, updateIntervieweeEvents] = useState([]);

  const serverURL = process.env.REACT_APP_SERVER_URL;
  const eventEndpoint = `${serverURL}/users/${user.id}/events`;

  useEffect(() => {
    fetch(`${eventEndpoint}/interviewer`, { credentials: 'include' })
      .then((res) => res.json())
      .then((events) => updateInterviewerEvents(events.map((e) => e.eventId)));

    fetch(`${eventEndpoint}/interviewee`, { credentials: 'include' })
      .then((res) => res.json())
      .then((events) => updateIntervieweeEvents(events.map((e) => e.eventId)));
  }, []);

  return (
    <>
      <PageHeader
        title='Your Events'
        subTitle={'here\'s what you have scheduled!'}
      />

      <div className='content'>
        <Link to='/create' className='create'>
          <Button type='primary' icon={<PlusOutlined />}>
            Create Event
          </Button>
        </Link>

        <h2>Interviewer</h2>
        {interviewerEvents.map((e) => (
          <EventCard key={e._id} event={e} isInterviewer />))}
        {interviewerEvents.length === 0 && (
          <em>You are not an interviwer for any events</em>)}

        <Divider />
        <h2>Interviewee</h2>
        {intervieweeEvents.map((e) => (
          <EventCard key={e._id} event={e} />))}
        {intervieweeEvents.length === 0 && (
          <em>You are not an interviwee for any events</em>)}
      </div>
    </>
  );
};

Events.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Events;

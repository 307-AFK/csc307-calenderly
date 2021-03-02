import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button, Form, DatePicker, Input,
} from 'antd';

const { RangePicker } = DatePicker;

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
      <EventDetails
        eventInfo={eventInfo}
        eventId={eventId}
      />
      <Interviewers users={eventInfo.interviewers} />
    </div>
  );
};

const EventDetails = (props) => {
  const { eventInfo, eventId } = props;
  const onFinish = (values) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventId}/update`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          startDate: values.daterange[0],
          endDate: values.daterange[1],
          interviewersNeeded: values.interviewersNeeded,
        }),
      });
  };
  return (
    <>
      <h3>{eventInfo.title}</h3>
      <h3>{eventInfo.startDate}</h3>
      <h3>{eventInfo.endDate}</h3>
      <h3>{eventInfo.description}</h3>
      <h3>{eventInfo.interviewersNeeded}</h3>
      <h3>{eventId}</h3>
      <Form onFinish={onFinish}>
        <Form.Item
          label='Event Title'
          name='title'
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          label='Start And End Dates'
          name='daterange'
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm'
          />
        </Form.Item>
        <Form.Item
          label='Description'
          name='description'
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          label='Interviewers Needed'
          name='interviewersNeeded'
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Update Event
          </Button>
        </Form.Item>
      </Form>
    </>
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

EventDetails.propTypes = {
  eventInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    description: PropTypes.string,
    interviewersNeeded: PropTypes.number.isRequired,
  }).isRequired,
  eventId: PropTypes.string.isRequired,
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

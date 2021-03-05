import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  PageHeader, Form, Radio, Typography, Button,
} from 'antd';

const { Title } = Typography;

const TimeSlotSelect = ({ event, userId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [currTimeSlot, setCurrTimeSlot] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event._id}/timeslots`,
      { credentials: 'include' })
      .then((res) => res.json())
      .then((ts) => setTimeSlots(ts));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event._id}/interviewees`,
      { credentials: 'include' })
      .then((res) => res.json())
      .then((interviewers) => setCurrTimeSlot(interviewers
        .find((i) => i.userId === userId).timeChosen));
  }, []);

  const onFinish = ({ timeSlot }) => {
    const timeChosen = new Date(timeSlot);
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event._id}/timeslot`, {
      method: 'POST', // TODO: change to PUT request
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, timeChosen }),
    });
  };

  return (
    <>
      <PageHeader
        title={event.title}
        subTitle='select a time slot for your interview'
      />
      <div className='content'>
        <Form onFinish={onFinish} initialValues={{ timeSlot: currTimeSlot }}>
          <Form.Item name='timeSlot'>
            <Radio.Group>
              {
                timeSlots.map((day) => (
                  <div key={day._id}>
                    <Title level={5}>{day.date.split('T')[0]}</Title>
                    <Time day={day} />
                  </div>
                ))
              }
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

const Time = ({ day }) => {
  // this should be found in the actual availability
  const hours = [
    { time: '9:00 am', dateTime: '00:09:00.000' },
    { time: '10:00 am', dateTime: '00:10:00.000' },
    { time: '11:00 am', dateTime: '00:11:00.000' },
    { time: '12:00 pm', dateTime: '00:12:00.000' },
    { time: '1:00 pm', dateTime: '00:13:00.000' },
    { time: '2:00 pm', dateTime: '00:14:00.000' },
    { time: '3:00 pm', dateTime: '00:15:00.000' },
    { time: '4:00 pm', dateTime: '00:16:00.000' },
    { time: '5:00 pm', dateTime: '00:17:00.000' },
  ];

  return (
    <>
      {
        day.times.map((t, i) => (
          t && (
            <Radio value={`${day.date.split('T')[0]}T${hours[i].dateTime}Z`} key={hours[i].time}>{`${hours[i].time} - ${hours[i + 1].time}`}</Radio>
          )
        ))
      }
    </>
  );
};

TimeSlotSelect.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
};

Time.propTypes = {
  day: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    times: PropTypes.arrayOf(PropTypes.bool).isRequired,
  }).isRequired,
};

export default TimeSlotSelect;

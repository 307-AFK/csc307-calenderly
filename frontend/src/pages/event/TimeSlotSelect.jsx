import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'antd';

const TimeSlotSelect = ({ event }) => {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event._id}/timeslots`,
      { credentials: 'include' })
      .then((res) => res.json())
      .then((ts) => setTimeSlots(ts));
  }, []);

  console.log(timeSlots);

  return (
    <>
      <PageHeader
        title={event.title}
        subTitle='select a time slot for your interview'
      />
      <div className='content'>
        {
          timeSlots.map((day) => (
            <Day key={day._id} day={day} />
          ))
        }
      </div>
    </>
  );
};

const Day = ({ day }) => {
  // this should be found in the actual availability
  const hours = [
    { time: '9:00 am' },
    { time: '10:00 am' },
    { time: '11:00 am' },
    { time: '12:00 pm' },
    { time: '1:00 pm' },
    { time: '2:00 pm' },
    { time: '3:00 pm' },
    { time: '4:00 pm' },
    { time: '5:00 pm' },
  ];

  return (
    <>
      <u>{day.date.split('T')[0]}</u>
      {
        day.times.map((t, i) => (
          t && (
            <div>{`${hours[i].time} - ${hours[i + 1].time}`}</div>
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
};

Day.propTypes = {
  day: PropTypes.shape({
    date: PropTypes.string.isRequired,
    times: PropTypes.arrayOf(PropTypes.bool).isRequired,
  }).isRequired,
};

export default TimeSlotSelect;

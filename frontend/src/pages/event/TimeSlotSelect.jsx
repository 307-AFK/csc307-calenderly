import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TimeSlotSelect = ({ eventId }) => {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventId}/timeslots`,
      { credentials: 'include' })
      .then((res) => res.json())
      .then((ts) => setTimeSlots(ts));
  }, []);

  console.log(timeSlots);

  return (
    <div>weewooweewoo</div>
  );
};

TimeSlotSelect.propTypes = {
  eventId: PropTypes.string.isRequired,
};

export default TimeSlotSelect;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  PageHeader,
  Button,
} from 'antd';

import Calendar from '../../components/Calendar';

const Availability = (props) => {
  const { eventId, avail, availId } = props;
  const [unsaved, setUnsaved] = useState(false);

  const updateAvailability = (index, status) => {
    const [day, time] = index;
    avail[day].times[time] = status;
    setUnsaved(true);
  };

  const saveAvailability = () => {
    if (!unsaved) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventId}/availability`, {
      method: 'POST', // TODO: change to PUT request
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ avail, availId }),
    })
      .then((res) => (res.status === 201 ? setUnsaved(false) : null));
  };

  return (
    <>
      <PageHeader
        title='Availability'
        subTitle='when are you free?'
      />
      <Row>
        <Col offset={2} span={20}>
          <Calendar times={avail} toggled={updateAvailability} />
          <Button onClick={saveAvailability} type='primary' disabled={!unsaved}>
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
};

Availability.propTypes = {
  avail: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.date,
    times: PropTypes.arrayOf(PropTypes.bool),
  })).isRequired,
  availId: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
};

export default Availability;

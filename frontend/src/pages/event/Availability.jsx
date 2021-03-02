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
  const { avail } = props;
  const [unsaved, setUnsaved] = useState(false);

  const updateAvailability = (index, status) => {
    const [day, time] = index;
    avail[day].times[time] = status;
    setUnsaved(true);
  };

  const saveAvailability = () => {
    if (!unsaved) return;
    setUnsaved(false);
    console.log(avail);
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
          <Button
            type={unsaved ? 'primary' : 'default'}
            onClick={saveAvailability}
          >
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
};

export default Availability;

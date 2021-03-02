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
  // TODO: true saving logic may have to be moved into the calendar
  const [unsaved, setUnsaved] = useState(false);

  const { avail } = props;

  return (
    <>
      <PageHeader
        title='Availability'
        subTitle='when are you free?'
      />
      <Row>
        <Col offset={2} span={20}>
          <Calendar times={avail} toggled={setUnsaved} />
          <Button
            type={unsaved ? 'primary' : 'default'}
            onClick={() => setUnsaved(false)}
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

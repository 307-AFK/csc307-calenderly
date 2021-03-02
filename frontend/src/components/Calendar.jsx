import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';

import styles from '../styles/Calendar.module.css';

const TimeSlotBtn = (props) => {
  const { val, tog } = props;
  const [available, toggle] = useState(val);

  const toggleAvailability = () => {
    toggle(!available);
    tog(true);
  };

  return (
    <Col span={4}>
      <Button
        onClick={() => toggleAvailability()}
        type={available ? 'primary' : 'default'}
        block='true'
      >
        {' '}
      </Button>
    </Col>
  );
};

const Calendar = (props) => {
  const { times, toggled } = props;

  const columns = [
    { title: 'Times', key: 'times' },
    { title: 'Monday', key: 'mon' },
    { title: 'Tuesday', key: 'tues' },
    { title: 'Wednesday', key: 'wed' },
    { title: 'Thursday', key: 'thurs' },
    { title: 'Friday', key: 'fri' },
  ];

  // this can be found in the actual availability
  const data = [
    { key: 0, time: '9:00 am' },
    { key: 1, time: '10:00 am' },
    { key: 2, time: '11:00 am' },
    { key: 3, time: '12:00 pm' },
    { key: 4, time: '1:00 pm' },
    { key: 5, time: '2:00 pm' },
    { key: 6, time: '3:00 pm' },
    { key: 7, time: '4:00 pm' },
  ];

  const setAvailability = () => {
    data.forEach((d, i) => {
      data[i].mon = times[0][i];
      data[i].tues = times[1][i];
      data[i].wed = times[2][i];
      data[i].thurs = times[3][i];
      data[i].fri = times[4][i];
    });
  };

  setAvailability();

  return (
    <>
      <Row>
        {columns.map((c) => (
          <Col key={c.key} span={4}>
            <b>{c.title}</b>
          </Col>
        ))}
      </Row>

      { data.map((d) => (
        <Row key={d.key} gutter={[4, 90]} className={styles.calRow}>
          <Col span={4}>{d.time}</Col>
          <TimeSlotBtn val={d.mon} tog={toggled} />
          <TimeSlotBtn val={d.tues} tog={toggled} />
          <TimeSlotBtn val={d.wed} tog={toggled} />
          <TimeSlotBtn val={d.thurs} tog={toggled} />
          <TimeSlotBtn val={d.fri} tog={toggled} />
        </Row>
      ))}
    </>
  );
};

TimeSlotBtn.propTypes = {
  val: PropTypes.bool.isRequired,
  tog: PropTypes.func.isRequired,
};

Calendar.propTypes = {
  times: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)).isRequired,
  toggled: PropTypes.func.isRequired,
};

export default Calendar;

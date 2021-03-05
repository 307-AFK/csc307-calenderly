import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';

import styles from '../styles/Calendar.module.css';

const TimeSlotBtn = (props) => {
  const { index, val, tog } = props;
  const [available, toggle] = useState(val);

  const toggleAvailability = () => {
    tog(index, !available);
    toggle(!available);
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
  ];

  const timeCols = [{ title: 'Times', key: 'times', vals: hours }];

  const dayCols = times.map((t) => (
    // eslint-disable-next-line no-underscore-dangle
    { title: t.date.split('T')[0], key: t._id, vals: t.times }
  ));

  const columns = timeCols.concat(dayCols);
  const rows = hours.map((h, i) => columns.map((c) => c.vals[i]));

  return (
    <>
      <Row>
        <Col span={4} align='center'><b>Times</b></Col>
        {dayCols && dayCols.map((c) => (
          <Col key={c.key} span={4} align='center'>
            <b>{c.title}</b>
          </Col>
        ))}
      </Row>

      {rows.map((r, i) => (
        <Row key={r[0].time} gutter={4} className={styles.calRow}>
          {r.map((c, j) => {
            if (j === 0) {
              return <Col key={(i, j)} span={4} align='right'>{c.time}</Col>;
            }

            return (
              <TimeSlotBtn
                key={(i, j)}
                index={[j - 1, i]} // the index on the supplied times arr
                val={c}
                tog={toggled}
              />
            );
          })}
        </Row>
      ))}

    </>
  );
};

TimeSlotBtn.propTypes = {
  index: PropTypes.arrayOf(PropTypes.number).isRequired,
  val: PropTypes.bool.isRequired,
  tog: PropTypes.func.isRequired,
};

Calendar.propTypes = {
  times: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.date,
    times: PropTypes.arrayOf(PropTypes.bool),
  })).isRequired,
  toggled: PropTypes.func.isRequired,
};

export default Calendar;

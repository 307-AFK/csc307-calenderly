import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
import {
  Col,
  Row,
  PageHeader,
  Button,
} from 'antd';
import Calendar from '../components/Calendar';

const exampleData = [
  [true, true, true, true, true, true, false, true],
  [true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true],
  [true, true, false, true, true, true, true, true],
  [true, true, true, true, true, true, true, true],
];

// const { id } = useParams();
const Event = () => {
  // TODO: true saving logic may have to be moved into the calendar
  const [unsaved, setUnsaved] = useState(false);

  return (
    <>
      <PageHeader
        title='Availability'
        subTitle='when are you free?'
      />
      <Row>
        <Col offset={2} span={20}>
          <Calendar times={exampleData} toggled={setUnsaved} />
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

export default Event;

import { React } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
  DatePicker,
} from 'antd';

const { RangePicker } = DatePicker;

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

export default EventDetails;

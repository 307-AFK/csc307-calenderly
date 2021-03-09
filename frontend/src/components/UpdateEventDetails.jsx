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
  const { updateEventInfo, eventInfo, eventId } = props;

  const onFinish = (values) => {
    console.log(values);
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventId}/update`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          startDate: values.daterange ? values.daterange[0] : null,
          endDate: values.daterange ? values.daterange[1] : null,
          interviewersNeeded: values.interviewersNeeded,
        }),
      }).then((res) => res.json())
      .then((e) => {
        if (e) {
          updateEventInfo(e.event);
        }
      });
  };
  return (
    <>
      <Form onFinish={onFinish}>
        <Form.Item
          label='Event Title'
          name='title'
        >
          <Input type='text' placeholder={eventInfo.title} />
        </Form.Item>
        <Form.Item
          label='Start And End Dates'
          name='daterange'
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm'
            placeholder={[eventInfo.startDate, eventInfo.endDate]}
          />
        </Form.Item>
        <Form.Item
          label='Description'
          name='description'
        >
          <Input type='text' placeholder={eventInfo.description} />
        </Form.Item>
        <Form.Item
          label='Interviewers Needed'
          name='interviewersNeeded'
        >
          <Input type='number' placeholder={eventInfo.interviewersNeeded} />
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
  updateEventInfo: PropTypes.func.isRequired,
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

import { React } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
  DatePicker,
} from 'antd';
import style from '../styles/UpdateEventDetails.module.css';

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
        <h1 className={style.title}>
          Update&nbsp;
          {eventInfo.title}
        </h1>
        <Form.Item
          className={style.titleEntry}
          labelCol={{ span: 24 }}
          label='Event Title'
          name='title'
        >
          <Input type='text' placeholder={eventInfo.title} />
        </Form.Item>
        <Form.Item
          className={style.dateRange}
          labelCol={{ span: 24 }}
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
          className={style.description}
          labelCol={{ span: 24 }}
          label='Description'
          name='description'
        >
          <Input.TextArea placeholder={eventInfo.description} />
        </Form.Item>
        <Form.Item
          className={style.interviewersNeeded}
          labelCol={{ span: 24 }}
          label='Interviewers Needed'
          name='interviewersNeeded'
        >
          <Input type='number' placeholder={eventInfo.interviewersNeeded} />
        </Form.Item>
        <Form.Item className={style.submit}>
          <Button className={style.but} type='primary' htmlType='submit'>
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

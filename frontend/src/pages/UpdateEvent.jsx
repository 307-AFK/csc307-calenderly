import {
    PageHeader, Form, Button, DatePicker, Input,
  } from 'antd';
  import { useState, React } from 'react';
  import { Redirect } from 'react-router';
  import { Link } from 'react-router-dom';
  import PropTypes from 'prop-types';
  
  import {
    ArrowLeftOutlined,
  } from '@ant-design/icons';
  
  const { RangePicker } = DatePicker;
  
  const UpdateEvent = (props) => {
    const { user, event } = props;
    const [redirect, setRedirect] = useState(false);
  
    if (redirect) {
      return <Redirect to='/' />;
    }
    return (
      <>
        <PageHeader
          title='Update Event'
        />
        <div className='content'>
          <Link to='/'>
            <Button type='primary' icon={<ArrowLeftOutlined />} />
          </Link>
          <UpdateEventForm user = {user} event={event} setRedirect={setRedirect} />
        </div>
      </>
    );
  };
  
  const UpdateEventForm = (props) => {
    const { user, event, setRedirect } = props;
    const{id} = user;
  
    const onFinish = (values) => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            startDate: values.daterange[0],
            endDate: values.daterange[1],
            eventCreator: id,
          }),
        }).then(() => {
        setRedirect({ redirect: true });
      });
    };
  
    return (
      <Form onFinish={onFinish}>
        <Form.Item
          label='Event Title'
          name='title'
          rules={[{ required: true, message: 'Please enter an event title!' }]}
        >
          <Input value = {event.title}/>
        </Form.Item>
        <Form.Item
          label='Start And End Dates'
          name='daterange'
          rules={[{ required: true, message: 'Please enter a date range!' }]}
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm'
            value = {[moment(event.startDate), moment(event.endDate)]}
          />
        </Form.Item>
        <Form.Item
          label='Description'
          name='description'
        >
          <Input.TextArea value = {event.description}/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Update Event
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  UpdateEvent.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };
  
  UpdateEventForm.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    setRedirect: PropTypes.func.isRequired,
  };
  
  export default UpdateEvent;
  
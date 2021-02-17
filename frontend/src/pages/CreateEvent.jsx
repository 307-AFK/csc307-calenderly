import { PageHeader, Form, Button, DatePicker, Input } from 'antd';
import { useState } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import {
   ArrowLeftOutlined,
 } from '@ant-design/icons';

 const { RangePicker } = DatePicker;

 const CreateEvent = (props) => {
   const [redirect, setRedirect] = useState(false);

   if(redirect)
      return <Redirect to='/'/>;
   return (
    <>
      <PageHeader
        title='Create new Event'
        subTitle={'schedule a new event!'}
      />
      <div className='content'>
         <Link to='/'>
            <Button type='primary' icon={<ArrowLeftOutlined />} />
         </Link>
         <CreateEventForm user={props.user} setRedirect={setRedirect} />
      </div>
    </>
  );
}

const CreateEventForm = (props) => {
   const onFinish = (values) => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/events`,
         {  method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               title: values.title,
               description: values.description,
               startDate: values.daterange[0],
               endDate: values.daterange[1],
               eventCreator: props.user.id,
            }),
         }).then(res => {
               props.setRedirect({ redirect: true });
            });
    };

   return (
      <Form onFinish={onFinish}>
         <Form.Item
            label='Event Title'
            name='title'
            rules={[{ required: true, message: 'Please enter an event title!' }]}
            >
            <Input />
         </Form.Item>
         <Form.Item
            label='Start And End Dates'
            name='daterange'
            rules={[{ required: true, message: 'Please enter a date range!' }]}
            >
            <RangePicker
               showTime={{ format: 'HH:mm' }}
               format='YYYY-MM-DD HH:mm'
            />
         </Form.Item>
         <Form.Item
            label='Description'
            name='description'>
            <Input.TextArea />
         </Form.Item>
         <Form.Item>
            <Button type='primary' htmlType='submit'>
               Create Event
            </Button>
         </Form.Item>
      </Form>
   )
}

export default CreateEvent;
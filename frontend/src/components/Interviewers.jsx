import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';

const Interviewers = ({ users, updateEventInfo }) => (
  <>
    <div>Current Interviewers:</div>
    {
      users.map((i) => <Interviewer key={i.userId} userId={i.userId} />)
    }
    <AddInterviewerForm updateEventInfo={updateEventInfo} />
  </>
);

const Interviewer = ({ userId }) => {
  const [userInfo, updateUserInfo] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
      { credentials: 'include' }).then((res) => res.json())
      .then((user) => {
        updateUserInfo(user);
      });
  }, [userId]);

  return (
    <div>
      {userInfo.name}
      (
      {userInfo.email}
      )
    </div>
  );
};

const AddInterviewerForm = ({ updateEventInfo }) => {
  const { eventId } = useParams();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventId}/interviewers`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
        }),
      }).then((res) => res.json())
      .then((data) => {
        if (data.event) {
          updateEventInfo(data.event);
        }
      });
  };

  return (
    <Form form={form} onFinish={onFinish} layout='inline'>
      <Form.Item
        label='New Interviewer'
        name='email'
        rules={[{ type: 'email' }]}
      >
        <Input />
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        +
      </Button>
    </Form>
  );
};

Interviewers.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({ userId: PropTypes.string }),
  ).isRequired,
  updateEventInfo: PropTypes.func.isRequired,
};

Interviewer.propTypes = {
  userId: PropTypes.string.isRequired,
};

AddInterviewerForm.propTypes = {
  updateEventInfo: PropTypes.func.isRequired,
};

export default Interviewers;

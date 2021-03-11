import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';

import {
  MinusSquareOutlined,
} from '@ant-design/icons';
import style from '../styles/AddInterviewer.module.css';

const Interviewers = ({ currUserId, users, updateEventInfo }) => (
  <>
    <h3 className={style.head}>Current Interviewers:</h3>
    {
      users.map((i) => (
        <Interviewer
          key={i.userId}
          currUserId={currUserId}
          userId={i.userId}
          updateEventInfo={updateEventInfo}
        />
      ))
    }
    <AddInterviewerForm updateEventInfo={updateEventInfo} />
  </>
);

const Interviewer = ({ currUserId, userId, updateEventInfo }) => {
  const [userInfo, updateUserInfo] = useState({});

  const { id } = useParams();

  const removeUser = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${id}/interviewers`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
        }),
      }).then((res) => res.json())
      .then((updatedEvent) => {
        updateEventInfo(updatedEvent);
      });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
      { credentials: 'include' }).then((res) => res.json())
      .then((user) => {
        updateUserInfo(user);
      });
  }, [userId]);

  if (userId === currUserId) {
    return (
      <div>
        {userInfo.name}
        (
        {userInfo.email}
        )
      </div>
    );
  }
  return (
    <div className={style.userInfo}>
      {userInfo.name}
      (
      {userInfo.email}
      )
      <Button danger type='text' icon={<MinusSquareOutlined />} onClick={removeUser} />
    </div>
  );
};

const AddInterviewerForm = ({ updateEventInfo }) => {
  const { id } = useParams();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${id}/interviewers`,
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
        className={style.NewInterviewer}
        label='New Interviewer'
        name='email'
        rules={[{ type: 'email' }]}
      >
        <Input />
      </Form.Item>
      <Button className={style.but} type='primary' htmlType='submit'>
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
  currUserId: PropTypes.string.isRequired,
};

Interviewer.propTypes = {
  userId: PropTypes.string.isRequired,
  currUserId: PropTypes.string.isRequired,
  updateEventInfo: PropTypes.func.isRequired,
};

AddInterviewerForm.propTypes = {
  updateEventInfo: PropTypes.func.isRequired,
};

export default Interviewers;

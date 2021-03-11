import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';

import {
  MinusSquareOutlined,
} from '@ant-design/icons';
import style from '../styles/AddInterviewee.module.css';

const Interviewees = ({ userIds, updateEventInfo }) => (
  <>
    <h3 className={style.head}>Current Interviewees:</h3>
    {
      userIds.map((id) => (
        <Interviewee
          key={id}
          userId={id}
          updateEventInfo={updateEventInfo}
        />
      ))
    }
    <AddIntervieweeForm updateEventInfo={updateEventInfo} />
  </>
);

const Interviewee = ({ userId, updateEventInfo }) => {
  const [userInfo, updateUserInfo] = useState({});

  const { id } = useParams();

  const removeUser = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${id}/interviewees`,
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

  return (
    <div>
      {userInfo.name}
      (
      {userInfo.email}
      )
      <Button danger type='text' icon={<MinusSquareOutlined />} onClick={removeUser} />
    </div>
  );
};

const AddIntervieweeForm = ({ updateEventInfo }) => {
  const { id } = useParams();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${id}/interviewees`,
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
        className={style.NewInterviewee}
        label='New Interviewee'
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

Interviewees.propTypes = {
  userIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateEventInfo: PropTypes.func.isRequired,
};

Interviewee.propTypes = {
  userId: PropTypes.string.isRequired,
  updateEventInfo: PropTypes.func.isRequired,
};

AddIntervieweeForm.propTypes = {
  updateEventInfo: PropTypes.func.isRequired,
};

export default Interviewees;

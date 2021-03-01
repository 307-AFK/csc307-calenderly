import React from 'react';
import { PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/Events.less';

import {
  PlusOutlined,
} from '@ant-design/icons';

// TODO: this could be moved into this file. probably won't be reused?
import ScheduledEvents from '../components/ScheduledEvents';

const Events = ({ user }) => (
  <>
    <PageHeader
      title='Your Events'
      subTitle={'here\'s what you have scheduled!'}
    />
    <div className='content'>
      <Link to='/create' className='create'>
        <Button type='primary' icon={<PlusOutlined />}>
          Create Event
        </Button>
      </Link>
      <ScheduledEvents user={user} />
    </div>
  </>
);

Events.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Events;

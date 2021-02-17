import { PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';
import '../styles/Events.less'

import {
   PlusOutlined,
 } from '@ant-design/icons';

const Events = () => {
  return (
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
         scheduled events will go here
      </div>
    </>
  );
}

export default Events;
import { PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';

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
         <Link to='/create'>
            <Button type='primary' icon={<PlusOutlined />}>
               Create Event
            </Button>
         </Link>
      </div>
    </>
  );
}

export default Events;
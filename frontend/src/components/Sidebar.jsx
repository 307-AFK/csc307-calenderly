import { Layout, Menu, PageHeader } from 'antd';
import { Link } from 'react-router-dom';

import {
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';

import '../styles/Sidebar.less';

const { Sider } = Layout;

const Sidebar = (props) => (
  <Sider breakpoint='lg' collapsedWidth='0' theme='light' className='sidebar'>
    <PageHeader title='Calenderly' />
    <Menu>
      <Menu.Item icon={ <CalendarOutlined /> }>
        <Link to='/'>My Events</Link>
      </Menu.Item>
      <Menu.Item icon={ <UserOutlined /> }>
        <Link to='/profile'>My Profile</Link>
      </Menu.Item>
    </Menu>
  </Sider>
);

export default Sidebar;

import { React, useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// components
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Card from './components/Card';

// pages
import Login from './pages/Login';
import Profile from './pages/Profile';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';

import './App.less';

const { Content } = Layout;

const App = () => {
  const [profile, updateProfile] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/account`,
      { credentials: 'include' }).then((res) => res.json())
      .then((account) => {
        if (Object.keys(account).length > 0) updateProfile(account);
      });
  }, []);

  return (
    <BrowserRouter>
      { profile ? (
        <Card width={16}>
          <Layout>
            <Sidebar />
            <Content>
              <Switch>
                <Route exact path='/'>
                  <Events />
                </Route>
                <Route path='/profile'>
                  <Profile user={profile} />
                </Route>
                <Route path='/create'>
                  <CreateEvent user={profile} />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Card>
      ) : <Login />}
    </BrowserRouter>
  );
};

export default App;

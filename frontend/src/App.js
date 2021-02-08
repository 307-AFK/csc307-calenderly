import { useState, useEffect } from 'react';

import Header from './components/Header';
import './App.css';

const App = () => {
  const [profile, updateProfile] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/account`,
      { credentials: 'include' })
    .then(res => res.json())
    .then(account => {
      if (Object.keys(account).length > 0) updateProfile(account);
    })
  }, []);

  return (
    <>
      <Header profile={profile} />
    </>
  )
}

export default App;

import GoogleSignIn from './GoogleSignIn';
import UserCard from './UserCard';

import styles from '../styles/Header.module.css';

const Header = props => (
  <header className={styles.header}>
    <h1>Calenderly</h1>
    <div className={styles.links}>
      {!props.profile && <GoogleSignIn />}
      {props.profile &&
        <>
          <UserCard name={props.profile.name} picture={props.profile.picture} />
          <a href={`${process.env.REACT_APP_SERVER_URL}/auth/logout`}>Logout</a>
        </>
      }
    </div>
  </header>
);

export default Header;

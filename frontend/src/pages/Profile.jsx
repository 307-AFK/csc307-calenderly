import { PageHeader, Button } from 'antd';

const Profile = (props) => {
  return (
    <>
      <PageHeader
        title='Profile'
        subTitle='all about you!'
      />
      <div className='content'>
        <img
          src={props.user.picture}
          alt={`${props.user.name}'s profile`}
          width='80'
          height='80'
        />
        <h2>{props.user.name}</h2>
        <p>{props.user.email}</p>
        <Button
          type='primary'
          href={`${process.env.REACT_APP_SERVER_URL}/auth/logout`}
        >Logout</Button>
      </div>
    </>
  );
}

export default Profile;

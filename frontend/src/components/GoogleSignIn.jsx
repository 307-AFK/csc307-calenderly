import { Button } from 'antd';

const SignIn = () => (
  <Button
    type='primary'
    href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}
    size='large'
  >
    sign in with Google
  </Button>
);

export default SignIn;

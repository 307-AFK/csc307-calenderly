import Card from '../components/Card';
import GoogleSignIn from '../components/GoogleSignIn';

import '../styles/LoginSplash.less';

const LoginSplash = () => (
  <div className='valign'>
    <Card width={10}>
      <div className='splash'>
        <h1>Calenderly</h1>
        <h3>interview scheduling made simple</h3>
        <GoogleSignIn />
      </div>
    </Card>
  </div>
);

export default LoginSplash;

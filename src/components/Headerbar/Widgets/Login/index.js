import { useContext } from 'react';
import LoginButton from './loginBtn';
import LoginProfileButton from './loginProfile';

import UserContext from '../../../../contexts/user';

const LoginWidget = () => {
  // Check the state of the user
  const user = useContext(UserContext);
  let loginDisplay = <LoginProfileButton />;  
  
  // Render a 'Login' button if the user is not logged in -> Directs to the login page
  if (user == null) {
    loginDisplay = <LoginButton />;
  }

  return (
    loginDisplay
  );
};

export default LoginWidget;

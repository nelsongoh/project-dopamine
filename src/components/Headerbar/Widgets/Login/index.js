import { useContext } from 'react';
import LoginButton from './loginBtn';
import LoginProfileButton from './loginProfile';
import LoginContext from '@/contexts/login';

const LoginWidget = () => {
  // Check the state of the user
  const { userToken } = useContext(LoginContext);
  let loginDisplay = <LoginProfileButton />;  
  
  // Render a 'Login' button if the user is not logged in -> Directs to the login page
  if (userToken == null) {
    loginDisplay = <LoginButton />;
  }

  return (
    loginDisplay
  );
};

export default LoginWidget;

import { createContext } from 'react';

const LoginContext = createContext({ 
  userToken: null,
  isLoggingIn: true,
  isAdmin: false,
  setIsLoggingIn: () => {} 
});

export default LoginContext;

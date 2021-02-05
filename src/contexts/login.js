import { createContext } from 'react';

const LoginContext = createContext({ userToken: null, isLoggingIn: true, setIsLoggingIn: () => {} });

export default LoginContext;

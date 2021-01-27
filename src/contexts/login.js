import { createContext } from 'react';

const LoginContext = createContext({ user: null, isLoggingIn: true, setIsLoggingIn: () => {} });

export default LoginContext;

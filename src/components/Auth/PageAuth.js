import { useContext, useEffect } from 'react';
import Router from 'next/router';
import LoginContext from '../../contexts/login';
import LoadingScreen from '../Loading/loading';
import DashboardContentAuth from './DashboardContentAuth';

const PageAuth = ({ ProtectedComponent, isContentProtected = false }) => {
  const { user, isLoggingIn } = useContext(LoginContext);

  useEffect(() => {
    if (user === null && isLoggingIn === false) {
      Router.push('/login');
    }
  }, [user, isLoggingIn]);

  if (isLoggingIn) {
    return <LoadingScreen />;
  };

  if (isContentProtected) {
    return (
      <DashboardContentAuth ProtectedComponent={ProtectedComponent} />
    );
  };

  return (
    <ProtectedComponent />
  );
}

export default PageAuth;

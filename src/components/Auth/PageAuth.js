import { useContext, useEffect } from 'react';
import Router from 'next/router';
import LoginContext from '../../contexts/login';
import LoadingScreen from '../Loading/loading';
import DashboardContentAuth from './DashboardContentAuth';
import routes from '../../routes';

const PageAuth = ({ ProtectedComponent, isContentProtected = false, permType = -1 }) => {
  const { user, isLoggingIn } = useContext(LoginContext);

  useEffect(() => {
    if (user === null && isLoggingIn === false) {
      Router.push(routes.public.index);
    }
  }, [user, isLoggingIn]);

  if (isLoggingIn) {
    return <LoadingScreen />;
  };

  if (isContentProtected) {
    return (
      <DashboardContentAuth ProtectedComponent={ProtectedComponent} permType={permType} />
    );
  };

  return (
    <ProtectedComponent />
  );
}

export default PageAuth;

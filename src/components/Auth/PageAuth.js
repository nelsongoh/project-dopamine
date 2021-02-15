import { Fragment, useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import LoginContext from '../../contexts/login';
import LoadingScreen from '../Loading/loading';
import DashboardContentAuth from './DashboardContentAuth';
import routes from '../../routes';

const PageAuth = ({ ProtectedComponent, isContentProtected = false, permType = -1 }) => {
  const { userToken, isLoggingIn } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userToken === null && !isLoggingIn) {
      Router.push(routes.index);
    } else {
      setIsLoading(false);
    }
  }, [userToken, isLoggingIn]);

  if (isContentProtected) {
    return (
      <DashboardContentAuth ProtectedComponent={ProtectedComponent} permType={permType} />
    );
  };

  return (
    isLoading || isLoggingIn ? 
    <LoadingScreen isOpen={isLoading} /> :
    <ProtectedComponent />
  );
}

export default PageAuth;

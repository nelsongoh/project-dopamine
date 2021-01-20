import { useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import UserContext from '../../contexts/user';
import LoadingScreen from '../Loading/loading';
import DashboardContentAuth from './DashboardContentAuth';

const PageAuth = ({ ProtectedComponent, isContentProtected = false }) => {
  const user = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user == null) {
      Router.push('/login');
    } else {
      setIsLoading(false); 
    }
  }, [user]);

  if (isLoading) {
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

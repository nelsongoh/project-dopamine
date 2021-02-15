import React, { useContext } from 'react';
import PageAuth from '../src/components/Auth/PageAuth';
import LoginContext from '../src/contexts/login';
import PermissionsContext from '../src/contexts/permissions';
import LoadingScreen from '../src/components/Loading/loading';
import Router from 'next/router';
import routes from '../src/routes';

const Dashboard = () => {
  // Update the user's view of the dashboard
  const { isLoggingIn } = useContext(LoginContext);
  const { permissions } = useContext(PermissionsContext);

  // If there are no permissions available and the user is not in the state of logging in
  if (!isLoggingIn && (permissions === null || permissions.length === 0)) {
    console.log(`No permissions found for the user while at the index Dashboard page.`);
    Router.push(routes.index);
  } else {
    const firstDashboardLink = permissions[0].url;
    Router.push(`${firstDashboardLink}`);
  }  
  
  return (
    <LoadingScreen isOpen={true} />
  );
};

const AuthDashboard = () => {
  return (
    <PageAuth ProtectedComponent={Dashboard} />
  )
};

export default AuthDashboard;

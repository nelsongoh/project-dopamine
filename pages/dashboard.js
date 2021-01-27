import React, { useContext } from 'react';
import PageAuth from '../src/components/Auth/PageAuth';
import LoginContext from '../src/contexts/login';
import useDashboardContent from '../lib/useDashboardContent';
import LoadingScreen from '../src/components/Loading/loading';
import Router from 'next/router';

const Dashboard = () => {
  // Fetch the user's view of the dashboard
  const { user, isLoggingIn } = useContext(LoginContext);
  const { content, isLoading, isError } = useDashboardContent(user);

  if (isLoading || isLoggingIn) {
    return <LoadingScreen />
  }

  if (isError) {
    console.log("There's an error.");
    Router.push("/");
  }

  const firstDashboardLink = (content.dashboard.views[0]).toLowerCase();
  Router.push(`/dashboard/${firstDashboardLink}`);
  
  return (
    <LoadingScreen />
  );
};

const AuthDashboard = () => {
  return (
    <PageAuth ProtectedComponent={Dashboard} />
  )
};

export default AuthDashboard;

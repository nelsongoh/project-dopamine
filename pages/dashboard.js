import React, { useContext } from 'react';
import PageAuth from '../src/components/Auth/PageAuth';
import UserContext from '../src/contexts/user';
import useDashboardContent from '../lib/useDashboardContent';
import LoadingScreen from '../src/components/Loading/loading';
import Router from 'next/router';

const Dashboard = () => {
  // Fetch the user's view of the dashboard
  const user = useContext(UserContext);
  const { content, isLoading, isError } = useDashboardContent(user);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    console.log("There's an error.");
    Router.push("/");
  }

  const firstDashboardLink = (content.dashboard.views[0]).toLowerCase();
  Router.push(`/dashboard/${firstDashboardLink}`);
  
  return (
    null
  );
};

const AuthDashboard = () => {
  return (
    <PageAuth ProtectedComponent={Dashboard} />
  )
};

export default AuthDashboard;

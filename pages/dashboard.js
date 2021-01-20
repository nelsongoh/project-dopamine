import React, { useContext } from 'react';
import Headerbar from '../src/components/Headerbar';
import PageAuth from '../src/components/Auth/PageAuth';
import UserContext from '../src/contexts/user';
import useDashboardContent from '../lib/useDashboardContent';
import LoadingScreen from '../src/components/Loading/loading';
import Sidebar from '../src/components/Sidebar';

const Dashboard = () => {
  // Fetch the user's view of the dashboard
  const user = useContext(UserContext);
  const { content, isLoading, isError } = useDashboardContent(user.uid);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    console.log("There's an error.");
  }
  
  return (
    <div>
      <Headerbar isTopStack={true} />
      <Sidebar content={content.dashboard.views} />
      <h1>INSIDE THE DASHBOARD</h1>
    </div>
  );
};

const AuthDashboard = () => {
  return (
    <PageAuth ProtectedComponent={Dashboard} />
  )
};

export default AuthDashboard;

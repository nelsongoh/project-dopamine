import React, { useContext } from 'react';
import Router from 'next/router';
import Headerbar from '../../../src/components/Headerbar';
import UserContext from '../../../src/contexts/user';
import useDashboardContent from '../../../lib/useDashboardContent';
import LoadingScreen from '../../../src/components/Loading/loading';
import Sidebar from '../../../src/components/Sidebar';

const DashboardContentAuth = ({ ProtectedComponent }) => {
  // Fetch the user's view of the dashboard
  const user = useContext(UserContext);
  const { content, isLoading, isError } = useDashboardContent(user);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    console.log("There's an error.");
  }

  // Check to see if the page that the user wants to access is part of their authorization
  console.log(Router.pathname);
  
  return (
    <div>
      <Headerbar isTopStack={true} />
      <Sidebar content={content.dashboard.views} />
      <div>
        <ProtectedComponent />
      </div>
    </div>
  );
};

export default DashboardContentAuth;

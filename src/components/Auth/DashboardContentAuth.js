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
    console.log("There's an error in the DashboardContentAuth component.");
    Router.push("/");
  }

  // Check to see if the page that the user wants to access is part of their authorization
  // If there is no content available, consider it an error
  if (content == null || typeof(content) == 'undefined') {
    console.log("Content is null or undefined in DashboardContentAuth");
    Router.push("/");
  } else if (content.dashboard.views.length == 0) {
    console.log("Content dashboard views length is 0");
    Router.push("/");
  } else {
    let isContentAuth = false;
    const contentViewSuffixes = Router.pathname.split("/");

    content.dashboard.views.forEach((view) => {
      if (view.toLowerCase() === contentViewSuffixes[contentViewSuffixes.length - 1]) {
        isContentAuth = true;
        break;
      }
    })

    if (!isContentAuth) {
      console.log("USER NOT AUTHORIZED TO VIEW PAGE.");
      Router.push("/");
    }
  }
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

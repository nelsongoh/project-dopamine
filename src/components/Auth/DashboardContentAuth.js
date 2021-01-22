import React, { useContext } from 'react';
import Router from 'next/router';
import Toolbar from '@material-ui/core/Toolbar';
import Headerbar from '../../../src/components/Headerbar';
import UserContext from '../../../src/contexts/user';
import useDashboardContent from '../../../lib/useDashboardContent';
import LoadingScreen from '../../../src/components/Loading/loading';
import Sidebar from '../../../src/components/Sidebar';
import useStyles from './dashboardContentAuthStyles';

const DashboardContentAuth = ({ ProtectedComponent }) => {
  const classes = useStyles();
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

    content.dashboard.views.every((view) => {
      if (view.toLowerCase() === contentViewSuffixes[contentViewSuffixes.length - 1]) {
        isContentAuth = true;
        return false;
      }
    })

    if (!isContentAuth) {
      console.log("USER NOT AUTHORIZED TO VIEW PAGE.");
      Router.push("/");
    }
  }
  
  return (
    <div className={classes.root}>
      <Headerbar isTopStack={true} />
      <Sidebar content={content.dashboard.views} />
      <div className={classes.content}>
        <Toolbar />
        <ProtectedComponent />
      </div>
    </div>
  );
};

export default DashboardContentAuth;

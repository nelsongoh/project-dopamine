import React, { useContext, useState } from 'react';
import Router from 'next/router';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Headerbar from '../../../src/components/Headerbar';
import LoginContext from '../../contexts/login';
import useDashboardContent from '../../../lib/useDashboardContent';
import LoadingScreen from '../../../src/components/Loading/loading';
import Sidebar from '../../../src/components/Sidebar';
import useStyles from './dashboardContentAuthStyles';
import routes from '../../routes';

const DashboardContentAuth = ({ ProtectedComponent, permType }) => {
  const classes = useStyles();
  // Fetch the user's view of the dashboard
  const { user } = useContext(LoginContext);
  const { content, isLoading, isError } = useDashboardContent(user);

  const container = typeof(window) !== 'undefined' ? () => window.document.body : undefined;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    console.log("There's an error in the DashboardContentAuth component.");
    Router.push(routes.public.index);
  }

  // Check to see if the page that the user wants to access is part of their authorization
  // If there is no content available, consider it an error
  if (content == null || typeof(content) == 'undefined') {
    console.log("Content is null or undefined in DashboardContentAuth");
    Router.push(routes.public.index);
  } else if (content.dashboard.views.length == 0) {
    console.log("Content dashboard views length is 0");
    Router.push(routes.public.index);
  } else {
    let isContentAuth = false;

    for (let i = 0; i < content.dashboard.views.length; i += 1) {
      if (content.dashboard.views[i] === permType) {
        isContentAuth = true;
        break;
      }
    }

    if (!isContentAuth) {
      console.log("USER NOT AUTHORIZED TO VIEW PAGE.");
      Router.push(routes.public.index);
      return <LoadingScreen />;
    }
  }

  return (
    <div className={classes.root}>
      <Headerbar isTopStack={true} toggleSidebar={toggleMobileSidebar} />
      <Hidden mdUp>
        <Sidebar
          content={content.dashboard.views}
          type="mobile"
          open={mobileSidebarOpen}
          onClose={toggleMobileSidebar}
          container={container}
        />
      </Hidden>
      <Hidden smDown>
        <Sidebar
          content={content.dashboard.views}
          type="perm"
        />
      </Hidden>
      <div className={classes.content}>
        <Toolbar />
        <ProtectedComponent />
      </div>
    </div>
  );
};

export default DashboardContentAuth;

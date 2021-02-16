import React, { Fragment, useContext, useState } from 'react';
import Router from 'next/router';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Headerbar from '../../../src/components/Headerbar';
import LoginContext from '../../contexts/login';
import PermissionsContext from '../../contexts/permissions';
import useDashboardContent from '../../../lib/client/useDashboardContent';
import LoadingScreen from '../../../src/components/Loading/loading';
import Sidebar from '../../../src/components/Sidebar';
import useStyles from './dashboardContentAuthStyles';
import routes from '../../routes';

const DashboardContentAuth = ({ ProtectedComponent, permType }) => {
  const classes = useStyles();
  const { isLoggingIn } = useContext(LoginContext);
  const { permissions, checkPermissions } = useContext(PermissionsContext);

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const container = typeof(window) !== 'undefined' ? () => window.document.body : undefined;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  }

  let isLoading = true;

  // If we're not in the process of logging in,
  // and we have retrieved the user's permissions
  if (!isLoggingIn && permissions !== null) {
    // If there are no permissions granted for the user
    // send them back to the index page
    if (permissions.length === 0 && !isLoading) {
      console.log("Allowed views is empty");
      isLoading = true;
      Router.push(routes.index);
    } else {
      const isUserAuthorized = checkPermissions(permType);
      if (!isUserAuthorized) {
        console.log("USER NOT AUTHORIZED TO VIEW PAGE.");
        isLoading = true;
        Router.push(routes.index);
      } else {
        isLoading = false;
      }
    }
  }

  return (
    <div className={classes.root}>
      <Headerbar isTopStack={true} toggleSidebar={toggleMobileSidebar} />
      {isLoading ? <LoadingScreen isOpen={isLoading} /> : (
        <Fragment>
          {isMobileView ? (
            <Sidebar
              type="mobile"
              open={mobileSidebarOpen}
              onClose={toggleMobileSidebar}
              container={container}
            />
          ) : (
            <Sidebar
              type="perm"
            />
          )}
          <div className={classes.content}>
            <Toolbar />
            <ProtectedComponent />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default DashboardContentAuth;

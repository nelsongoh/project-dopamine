import React from 'react';
import Router from 'next/router';
import PageAuth from '@/components/Auth/PageAuth';
import LoadingScreen from '@/components/Loading/loading';
import permissions from '../../src/permissions';
import routes from '../../src/routes';

const DashboardAdmin = () => {
  const adminSublinks = routes.protected[permissions.admin].sublinks;
  if (adminSublinks.length > 0) {
    Router.push(`${adminSublinks[0].url}`);
  } else {
    console.log("No available sublinks for this admin user. Routing back to the dashboard.");
    Router.push(routes.public.index);
  }

  return (
    <LoadingScreen />
  );
};

const AuthAdmin = () => {
  return (
    <PageAuth ProtectedComponent={DashboardAdmin} isContentProtected={true} permType={permissions.admin} />
  );
};

export default AuthAdmin;

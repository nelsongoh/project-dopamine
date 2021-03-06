import React from 'react';
import PageAuth from '@/components/Auth/PageAuth';
import permissions from '@/permissions';

const DashboardIG = () => {
  return (
    <h1>Hi there</h1>
  );
};

const AuthIG = () => {
  return (
    <PageAuth ProtectedComponent={DashboardIG} isContentProtected={true} permType={permissions.ig} />
  )
};

export default AuthIG;

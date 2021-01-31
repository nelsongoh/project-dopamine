import React from 'react';
import PageAuth from '../../src/components/Auth/PageAuth';

const DashboardIG = () => {
  return (
    <h1>Hi there</h1>
  );
};

const AuthIG = () => {
  return (
    <PageAuth ProtectedComponent={DashboardIG} isContentProtected={true} />
  )
};

export default AuthIG;

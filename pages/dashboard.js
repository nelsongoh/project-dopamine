import React from 'react';
import Headerbar from '../src/components/Headerbar';
import PageAuth from '../src/components/Auth/PageAuth';

const Dashboard = () => {
  return (
    <div>
      <Headerbar />
      <h1>INSIDE THE DASHBOARD</h1>
    </div>
  );
};

const AuthDashboard = () => {
  return (
    <PageAuth ProtectedComponent={Dashboard} />
  )
}

export default AuthDashboard;

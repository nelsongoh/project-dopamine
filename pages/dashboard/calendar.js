import React from 'react';
import PageAuth from '../../src/components/Auth/PageAuth';
import Calendar from '../../src/components/Calendar/calendar';

const DashboardCalendar = () => {
  return (
    <Calendar />
  );
};

const AuthCalendar = () => {
  return (
    <PageAuth ProtectedComponent={DashboardCalendar} isContentProtected={true} />
  )
}

export default AuthCalendar;

import React, { useContext, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import PageAuth from '@/components/Auth/PageAuth';
import Calendar from '@/components/Calendar/calendar';
import LuckyColors from '@/components/LuckyColors';
import LuckyDirections from '@/components/LuckyDirections';
import useCalendarOverlay from '@/client-lib/useCalendarOverlay';
import LoadingScreen from '@/components/Loading/loading';
import LoginContext from '@/contexts/login';
import permissions from '@/permissions';

const DashboardCalendar = () => {
  const [currDate, setCurrDate] = useState(new Date());
  const setNextMth = () => {
    setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1));
  };
  const setPrevMth = () => {
    setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1));
  };

  const { userToken } = useContext(LoginContext);
  // The use of this reference is to help determine if an API fetch call is necessary
  const overlayInfo = useRef(null);
  const { content, isLoading, isError } = useCalendarOverlay(userToken, overlayInfo.current);

  if (isError) {
    console.log('An error has occurred while trying to retrieve the calendar overlay');
  } else {
    // If the content retrieved is not undefined and we do not currently have any overlay info, we update it
    if (overlayInfo.current === null && typeof(content) !== 'undefined') {
      overlayInfo.current = content;
    }
  }

  return (
    isLoading ? <LoadingScreen isOpen={isLoading} /> : (
      <Grid container spacing={3} justify="center">
        <Grid item xs={12} md={6}>
          <Calendar content={overlayInfo.current} currDate={currDate} setNextMth={setNextMth} setPrevMth={setPrevMth} />
        </Grid>
        <Grid container item md={6} direction="column" alignItems="center" spacing={5}>
          <Grid container item alignItems="stretch">
            <LuckyDirections content={overlayInfo.current.directions} currDate={currDate} />
          </Grid>
          <Grid container item alignItems="stretch">
            <LuckyColors content={overlayInfo.current.colors} currDate={currDate} />
          </Grid>
        </Grid>
      </Grid>
    )
  );
};

const AuthCalendar = () => {
  return (
    <PageAuth ProtectedComponent={DashboardCalendar} isContentProtected={true} permType={permissions.calendar} />
  )
}

export default AuthCalendar;

import React, { useContext } from 'react';
import PageAuth from '../../src/components/Auth/PageAuth';
import Grid from '@material-ui/core/Grid';
import ProfileImage from '../../src/components/ProfileImage';
import ProfileForm from '../../src/components/Form/Profile';

const DashboardProfile = () => {
  return (
    <Grid spacing={5} container direction="column" alignItems="center">
      <Grid item>
        <ProfileImage />
      </Grid>
      <ProfileForm />
    </Grid>
  );
};

const AuthProfile = () => {
  return (
    <PageAuth ProtectedComponent={DashboardProfile} isContentProtected={true} />
  )
};

export default AuthProfile;

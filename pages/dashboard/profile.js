import React, { useContext } from 'react';
import PageAuth from '@/components/Auth/PageAuth';
import Grid from '@material-ui/core/Grid';
import ProfileImage from '@/components/ProfileImage';
import ProfileForm from '@/components/Form/Profile';
import permissions from '../../src/permissions';

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
    <PageAuth ProtectedComponent={DashboardProfile} isContentProtected={true} permType={permissions.profile} />
  )
};

export default AuthProfile;

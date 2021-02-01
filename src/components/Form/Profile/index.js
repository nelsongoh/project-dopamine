import React, { Fragment, useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Content from '../../../lang';
import LoginContext from '../../../contexts/login';
import useStyles from './profileStyles';
import { validateEditProfile } from '../../../../utils/validation/form';
import { Profile, ProfileErrors } from '../../../models/profile';
import { changeUserPwd } from '../../Auth/FirebaseAuth';
import EmailCredentialReAuth from '../../Auth/EmailCredentialReAuth';

const ProfileForm = () => {
  const classes = useStyles();
  const { user } = useContext(LoginContext);

  const [chngPwd, setChngPwd] = useState(Profile());
  const [editProfileErrors, setEditProfileErrors] = useState(ProfileErrors());

  const resetFields = () => {
    setChngPwd(Profile());
    setEditProfileErrors(ProfileErrors());
  };

  const [displayReAuth, setDisplayReAuth] = useState(false);
  const openDisplayReAuth = () => {
    setDisplayReAuth(true);
  };
  const closeDisplayReAuth = () => {
    setDisplayReAuth(false);
  };

  const changePwd = async () => {
    let chngPwdOutcome = await changeUserPwd(chngPwd.newPwd);
    if (chngPwdOutcome.error.isPwdWeak) {
      setEditProfileErrors({
        newPwd: {
          hasError: true,
          errorMsg: "The new password is too weak. Please use a stronger password.",
        },
        reEnterPwd: {
          hasError: false,
          errorMsg: "",
        }
      });
    } else if (chngPwdOutcome.error.reqReLogin) {
      openDisplayReAuth();
    } else if (chngPwdOutcome.error.others) {
      setEditProfileErrors({
        newPwd: {
          hasError: true,
          errorMsg: "An error has occurred while changing your password. Please try again later.",
        },
        reEnterPwd: {
          hasError: false,
          errorMsg: "",
        }
      });
    } else {
      // The password change was successful, display a notification
      openSnackbar();
      // Reset the change password fields
      resetFields();
    }
  } 

  const submitPwdChng = () => {
    // We reset the text field errors first
    setEditProfileErrors(ProfileErrors());

    if (chngPwd.newPwd.replaceAll(" ", "") !== "" && chngPwd.reEnterPwd.replaceAll(" ", "") !== "") {
      if (validateEditProfile(chngPwd.newPwd, chngPwd.reEnterPwd) === true) {
        // Present a pop-up to ask the user to reauthenticate their credentials
        openDisplayReAuth();
      } else {
        // Display an error to the user
        setEditProfileErrors({
          newPwd: {
            hasError: true,
            errorMsg: Content('en').pages.profile.textFields.pwdErrorMsg,
          },
          reEnterPwd: {
            hasError: true,
            errorMsg: Content('en').pages.profile.textFields.pwdErrorMsg,
          },
        });
      }
    }
  };

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const openSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <Fragment>
      {displayReAuth ? <EmailCredentialReAuth
        closeDialog={closeDisplayReAuth} 
        callbackFunc={changePwd}
      /> : null}
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success">
          {Content('en').pages.profile.snackbar.success.msg}
        </Alert>
      </Snackbar>
      <Grid container item className={classes.formWidth} spacing={3}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            InputProps={{ readOnly: true }}
            label={Content('en').pages.profile.textFields.name}
            value={user.displayName || "???"}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            InputProps={{ readOnly: true }}
            label={Content('en').pages.profile.textFields.email}
            value={user.email}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label={Content('en').pages.profile.textFields.newPwd}
            value={chngPwd.newPwd}
            onChange={(event) => { setChngPwd({...chngPwd, newPwd: event.target.value}) }}
            error={editProfileErrors.newPwd.hasError}
            helperText={editProfileErrors.newPwd.errorMsg}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label={Content('en').pages.profile.textFields.reEnterPwd}
            value={chngPwd.reEnterPwd}
            onChange={(event) => { setChngPwd({...chngPwd, reEnterPwd: event.target.value}) }}
            error={editProfileErrors.reEnterPwd.hasError}
            helperText={editProfileErrors.reEnterPwd.errorMsg}
            fullWidth
          />
        </Grid>
        <Grid container item xs={12} justify="center" alignItems="center">
          <Button variant="outlined" color="primary" className={classes.btn} onClick={resetFields}>Cancel</Button>
          <Button variant="contained" color="primary" className={classes.btn} onClick={submitPwdChng}>Save</Button>
        </Grid>
      </Grid>
    </Fragment>
  )
};

export default ProfileForm;

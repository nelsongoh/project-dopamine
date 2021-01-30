import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { User } from '../../models/login';
import Content from '../../lang';
import useStyles from './emailCredentialReAuthStyles';
import { getEmailAuthCred, reAuthUser } from '../Auth/FirebaseAuth';
import { ReAuthErrors } from '../../models/reauth';
 
const EmailCredentialReAuth = ({ closeDialog, callbackFunc }) => {
  const classes = useStyles();
  const [userCred, setUserCred] = useState(User());
  const [isReAuthInProgress, setIsReAuthInProgress] = useState(false);

  const updateTextField = (fieldType, fieldValue) => {
    setUserCred({...userCred, [fieldType]: fieldValue});
  };

  const cancelEmailCredReAuth = () => {
    setUserCred(User());
    setIsReAuthInProgress(false);
    closeDialog();
  }

  const shouldDisableSubmitBtn = () => {
    if (userCred.email.replaceAll(" ", "") == "" || userCred.pwd.replaceAll(" ", "") == "") {
      return true;
    }

    if (isReAuthInProgress) {
      return true;
    }

    return false;
  };

  const [authFieldError, setAuthFieldError] = useState(ReAuthErrors());

  const conductReAuth = async () => {
    // Disable the submit button
    setIsReAuthInProgress(true);

    const reAuthedCred = getEmailAuthCred(userCred.email, userCred.pwd);
    let reAuthOutcome = await reAuthUser(reAuthedCred);
    // If re-authentication is successful
    if (reAuthOutcome.error.hasError === false) {
      // trigger the callback function
      callbackFunc()
      // and close the dialog
      cancelEmailCredReAuth();
    } else {
      // Else, display the error
      setAuthFieldError({ 
        hasError: reAuthOutcome.error.hasError, 
        errorMsg: reAuthOutcome.error.errorMsg 
      });

      // And enable the submit button
      setIsReAuthInProgress(false);
    }
  };

  return (
    <Dialog open>
      <DialogTitle>{Content('en').reauth.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {Content('en').reauth.contentMsg}
        </DialogContentText>
        <form className={classes.root}>
          <TextField 
            autoFocus
            variant="outlined"
            id="loginUser"
            label={Content('en').reauth.emailField}
            type="email"
            value={userCred.email}
            onChange={(event) => { updateTextField('email', event.target.value) }}
            error={authFieldError.hasError}
            helperText={authFieldError.errorMsg}
            fullWidth
          />
          <TextField 
            variant="outlined"
            id="loginPwd"
            label={Content('en').reauth.pwdField}
            type="password"
            value={userCred.pwd}
            onChange={(event) => { updateTextField('pwd', event.target.value) }}
            fullWidth
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={cancelEmailCredReAuth}>{Content('en').reauth.btns.cancel}</Button>
        <Button color="primary" disabled={shouldDisableSubmitBtn()} onClick={conductReAuth}>{Content('en').reauth.btns.submit}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailCredentialReAuth;

import { useState, useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './loginStyles';
import Content from '../../lang/index';
import { signInUserEmailPwd } from '../Auth/FirebaseAuth';
import CircularProgress from '@material-ui/core/CircularProgress';
import { User, LoginErrors } from '../../models/login';
import Router from 'next/router';
import LoginContext from '../../contexts/login';

const LoginForm = () => {
  const classes = useStyles();
  // Need to add in the error message state
  const [userCred, setUserCred] = useState(User());
  const [errors, setErrors] = useState(LoginErrors());
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [spinner, setSpinner] = useState(null);
  const { user, setIsLoggingIn } = useContext(LoginContext);

  useEffect(() => {
    if (user !== null) {
      Router.push("/dashboard");
    }
  }, [user])

  // Function to log the user in, triggers the spinner while waiting for the sign-in to complete
  const loginUser = async () => {
    // Disable the login button
    setLoginDisabled(true);
    // Start the spinner
    setSpinner(<CircularProgress />);
    // Set the user's login progress to true
    setIsLoggingIn(true);
    // Sign the user in
    const signInOutcome = await signInUserEmailPwd(userCred.email, userCred.pwd);
    // Set the user's login progress to false
    setIsLoggingIn(false);
    // End the spinner
    setSpinner(null);
    // Enable the login button again
    setLoginDisabled(false);
    // Set the error messages (if any)
    setErrors(signInOutcome.error);
  }

  return (
    <Paper variant="outlined" className={classes.form}>
      <div className={classes.spinner}>
        {spinner}
      </div>
      <form className={classes.root}>
        <TextField 
          label={Content('en').pages.login.form.email.label} 
          type="email" value={userCred.email} 
          onChange={(e) => { setUserCred({...userCred, email: e.target.value }); }} 
          error={errors.email.hasError}
          helperText={errors.email.msg}
        />
        <TextField 
          label={Content('en').pages.login.form.pwd.label}
          type="password" value={userCred.pwd}
          onChange={(e) => { setUserCred({...userCred, pwd: e.target.value }) }} 
          error={errors.pwd.hasError}
          helperText={errors.pwd.msg}
        />
      </form>
      <Button
        variant="contained"
        className={classes.btn}
        onClick={() => { loginUser(); }}
        disabled={loginDisabled}
      >
        {Content('en').pages.login.btn.title}
      </Button>
    </Paper>
  );
};

export default LoginForm;

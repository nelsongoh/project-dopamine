import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './loginStyles';
import Link from '../Link';
import Content from '../../lang/index';

const LoginForm = () => {
  const classes = useStyles();
  const [userCred, setUserCred] = useState({
    email: "",
    pwd: "",
  })

  return (
    <Paper variant="outlined" className={classes.form}>
      <form className={classes.root}>
        <TextField label={Content('en').login.form.email.label} type="email" value={userCred.email} onChange={(e) => { setUserCred({...userCred, email: e.target.value }) }} />
        <TextField label={Content('en').login.form.pwd.label} type="password" value={userCred.pwd} onChange={(e) => { setUserCred({...userCred, pwd: e.target.value }) }} />
      </form>
      <Button variant="contained" className={classes.btn} href="/dashboard" component={Link}>
        Login
      </Button>
    </Paper>
  );
};

export default LoginForm;

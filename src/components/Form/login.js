import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './loginStyles';
import Link from '../Link';

const LoginForm = () => {
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.form}>
      <form className={classes.root}>
        <TextField label="Email address" />
        <TextField label="Password" />
      </form>
      <Button variant="contained" className={classes.btn} href="/dashboard" component={Link}>
        Login
      </Button>
    </Paper>
  );
};

export default LoginForm;

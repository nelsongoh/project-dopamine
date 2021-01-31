import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    }
  },

  form: {
    padding: '2em',
    maxWidth: '50ch',
    margin: 'auto',
  },

  btn: {
    width: '50%',
    marginLeft: '25%',
    marginRight: '25%',
    marginTop: '2em',
  },

  spinner: {
    marginLeft: '50%',
    marginRight: '50%',
  },
}));

export default useStyles;

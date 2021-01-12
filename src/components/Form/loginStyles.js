import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: '40ch',
    }
  },

  form: {
    padding: '2em',
    width: '50ch',
    margin: 'auto',
  },

  btn: {
    width: '50%',
    marginLeft: '25%',
    marginRight: '25%',
    marginTop: '2em',
  }
}));

export default useStyles;

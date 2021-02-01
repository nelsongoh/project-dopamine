import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formWidth: {
    [theme.breakpoints.down('sm')]: {
      width: '48ch',
    },
    [theme.breakpoints.up('md')]: {
      width: '48ch',
    },
  },

  btn: {
    marginLeft: '1em',
    marginRight: '1em',
  },
}));

export default useStyles;

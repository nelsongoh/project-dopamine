import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formDiv: {
    marginTop: theme.spacing(3),
  },

  halfWidthLeftField: {
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(3),
    },
  },

  btn: {
    marginLeft: '1em',
    marginRight: '1em',
  },
}));

export default useStyles;

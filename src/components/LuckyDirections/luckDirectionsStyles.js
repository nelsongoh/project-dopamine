import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  directions: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  locations: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default useStyles;

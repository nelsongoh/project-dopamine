import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 0,
  },

  title: {
    flex: 1,
  },

  normStack: {
    zIndex: 0,
  },

  topStack: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default useStyles;
